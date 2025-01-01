<script setup lang="ts">
  import { JsonRpcClient } from 'bunson';
  import useAppMode from '~/composables/useAppMode'
  import useAppSheet from '~/composables/useAppSheet'
  import { onMounted, computed, ref } from 'vue'
  const { currentComponent, setMode } = useAppMode()
  import { modes } from '~/composables/consts'
  const { currentSheet, currentSpriteId, initSheetForTest, currentSpriteGroupId, updateSheet, fileName, setFileName } = useAppSheet()
  import { useKeyHandler } from '~/composables/useKeyHandler'
  import SpriteGroup from '~/core/SpriteGroup';
  import Sprite from '~/core/Sprite';
  import Sheet from '~/core/Sheet';
  import ColorState from '~/core/ColorState';
  import SpriteLogic from '~/logics/SpriteLogic';
  import SpriteGroupLogic from '~/logics/SpriteGroupLogic';
  import Preview from './components/Preview.vue';
  import Help from './components/Help.vue';
  import SheetLogic from '~/logics/SheetLogic';
  import KeyMapConfig from '~/configs/actionKeyMap.json'
  setMode(modes.SPRITE_EDITOR)
  const scale = ref<number>(100)
  const focusingFileNameInput = ref<boolean>(false)

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"
  const FILE_NAME = import.meta.env.VITE_FILE_NAME || "default"
  const urlParams = new URLSearchParams(window.location.search)
  const queryForFileName = 'file'
  const fileNameFromUrl = urlParams.get(queryForFileName)
  setFileName(fileNameFromUrl || FILE_NAME)

  const sheetHistory = ref<string[]>([])
  const historyIndex = ref(0)

  onMounted(() => {
    if (import.meta.env.MODE === 'test') {
      initSheetForTest()
    } else {
      openFile();
    }
  })

  const jsonRpcClient = new JsonRpcClient(SERVER_URL, {
    methods: ['save', 'load', 'exportGroup', 'exportSheet'],
    cors: 'cors'
  })

  const handleChangeMode = (mode: typeof modes[keyof typeof modes], spriteId: number) => {
    setMode(mode)
    currentSpriteId.value = spriteId
  }
  const updateCurrentSpriteId = (id: number) => {
    currentSpriteId.value = id
  }

  const save = async () => {
    const response = await jsonRpcClient.call('save', { 
      sheet: currentSheet.value,
      saveMode: 'local',
      saveOptions: {
        localPath: `${fileName.value}.json`
      }
    }, 0)
    urlParams.set(queryForFileName, fileName.value)
    history.pushState({}, '', `${location.pathname}?${urlParams.toString()}`)
    if ('error' in response) {
      console.error(response.error)
    }
  }
  const exportAsGif = async () => {
    const sprites = SheetLogic.getClippedSpritesInGroup(currentSheet.value, currentSpriteGroupId.value)
    const response = await jsonRpcClient.call('exportGroup', { 
      format: 'gif',
      sprites: sprites,
      palette: currentSheet.value.palette,
      localPath: `${fileName.value}0.gif`,
      options: {
        gif: {
          delay: 100,
          repeat: true,
          quality: 10,
        }
      }
    });
    if ('error' in response) {
      console.error(response.error)
    }
  }

  const openFile = async () => {
    const response = await jsonRpcClient.call('load', {     
      saveMode: 'local',
      localPath: `${fileName.value}.json`
    }, 0)
    if ('result' in response && response.result) {
      updateSheet(response.result as Sheet)
      currentSpriteId.value = 0
      currentSpriteGroupId.value = 0
      urlParams.set(queryForFileName, fileName.value)
      history.pushState({}, '', `${location.pathname}?${urlParams.toString()}`)
      updateSheetHistory()
    } else if ('error' in response) {
      console.error(response.error)
    }
  }
  const newSheet = () => {
    const sheet = new Sheet("sheet")
    SheetLogic.addSprite(sheet)
    SpriteGroupLogic.addSprite(sheet.groups[0], 0)
    updateSheet(sheet)
  }
  const exportSheet = async () => {
    const response = await jsonRpcClient.call('exportSheet', { 
      sheet: currentSheet.value,
      localPath: `${fileName.value}`
    });
    if ('error' in response) {
      console.error(response.error)
    }
  }

  type ManipulationAction = "goToSheetEditor" | "zoomIn" | "zoomOut" | "undo" | "redo"
  const scaleStep = 10
  const manipulationActions: Record<ManipulationAction, () => void> = {
    "goToSheetEditor": () => {
      setMode(modes.SHEET_EDITOR)
    },
    "zoomIn": () => {
      scale.value += scaleStep
    },
    "zoomOut": () => {
      scale.value = Math.max(scale.value - scaleStep, 10)
    },
    "undo": () => {
      if (sheetHistory.value.length === 0) {
        return
      }
      historyIndex.value = Math.max(historyIndex.value - 1, 0)
      updateSheet(JSON.parse(sheetHistory.value[historyIndex.value]) as Sheet)
    },
    "redo": () => {
      if (sheetHistory.value.length === 0) {
        return
      }
      historyIndex.value = Math.min(historyIndex.value + 1, sheetHistory.value.length - 1)
      updateSheet(JSON.parse(sheetHistory.value[historyIndex.value]) as Sheet)
    },
  }
  useKeyHandler(manipulationActions)

  const updateSheetHistory = () => {
    historyIndex.value = historyIndex.value + 1
    sheetHistory.value = sheetHistory.value.slice(0, historyIndex.value)
    sheetHistory.value.push(JSON.stringify(currentSheet.value))
  }

  const updateSprite = (x: number, y: number, color: number) => {
    const originalSheet = JSON.stringify(currentSheet.value)
    SpriteLogic.updateSprite(currentSheet.value.sprites[currentSpriteId.value], { x, y, color } )
    if (originalSheet !== JSON.stringify(currentSheet.value)) {
      updateSheetHistory()
    }
  }
  const updateSpriteSize = (left: number, top: number, bottom: number, right: number) => {
    const originalSheet = JSON.stringify(currentSheet.value)
    SpriteLogic.updateSpriteSize(currentSheet.value.sprites[currentSpriteId.value], left, top, bottom, right)
    if (originalSheet !== JSON.stringify(currentSheet.value)) {
      updateSheetHistory()
    }
  }

  const updateClipSize = (width: number, height: number) => {
    const originalSheet = JSON.stringify(currentSheet.value)
    SpriteGroupLogic.changeClipSize(currentSheet.value.groups[currentSpriteGroupId.value], {width, height})
    if (originalSheet !== JSON.stringify(currentSheet.value)) {
      updateSheetHistory()
    }
  }
  const updatePalette = (color: ColorState | null, cellId: number) => {
    const originalSheet = JSON.stringify(currentSheet.value)
    SheetLogic.updatePalette(currentSheet.value, color, cellId)
    if (originalSheet !== JSON.stringify(currentSheet.value)) {
      updateSheetHistory()
    }
  }

  const updateGroupName = (name: string) => {
    const originalSheet = JSON.stringify(currentSheet.value)
    SpriteGroupLogic.updateName(currentSheet.value.groups[currentSpriteGroupId.value], name)
    if (originalSheet !== JSON.stringify(currentSheet.value)) {
      updateSheetHistory()
    }
  }

  const clippedSpritesForPreview = computed(() => {
    return SheetLogic.getClippedSpritesInGroup(currentSheet.value, currentSpriteGroupId.value) as Sprite[]
  })

</script>

<template>
  <div class="app-wrapper">
    <input v-model="fileName" class="file-name-input" @focus="focusingFileNameInput=true" @blur="focusingFileNameInput=false" />
    <div class="app-container">
      <div class="metadata-tools container">
        <button @click="newSheet">New</button>
        <button @click="openFile">Open</button>
        <button @click="exportSheet">Export</button>
        <button @click="save">Save</button>
        <button @click="exportAsGif">Export as Gif</button>
        <div class="scale">
          <span>{{ scale }}%</span>
          <button @click="manipulationActions.zoomIn">+</button>
          <button @click="manipulationActions.zoomOut">-</button></div>
      </div>
      <div class="editor-wrapper">
       <component 
          :is="currentComponent" 
          :sheet="currentSheet" 
          :sprite="currentSheet.sprites[currentSpriteId] as Sprite"
          :spriteId="currentSpriteId"
          :handleChangeMode="handleChangeMode"
          :spriteGroup="currentSheet.groups[currentSpriteGroupId] as SpriteGroup"
          :updateSprite="updateSprite"
          :updateSpriteSize="updateSpriteSize"
          :updateClipSize="updateClipSize"
          :groupSprites="[]"
          :currentSpriteGroupId="currentSpriteGroupId"
          :updateCurrentSpriteGroupId="(id: number) => {currentSpriteGroupId = id}"
          :palette="currentSheet.palette"
          :updatePalette="updatePalette"
          :scale="scale"
          :acceptKeyInput="!focusingFileNameInput"
          :updateCurrentSpriteId="updateCurrentSpriteId"
        />
      </div> 
      <div class="common-tool-wrapper">
        <Preview
            :sprites="clippedSpritesForPreview"
            :name="currentSheet.groups[currentSpriteGroupId].name"
            :updateGroupName="updateGroupName"
            :palette="currentSheet.palette"
            :acceptKeyInput="!focusingFileNameInput"
            :focusedSpriteIndex="currentSheet.groups[currentSpriteGroupId].sprites.indexOf(currentSpriteId)"
        />
        <div class="app-help-wrapper">
          <Help :keyActionMap="KeyMapConfig"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  min-width: 60vw;
  .editor-wrapper {
    margin-top: 20px;
  }
}
.app-container{
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
}
.metadata-tools {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: fit-content;
  .scale {
    margin-left: 10px;
    margin-right: 10px;
  }
}
input.file-name-input {
  width: 100%;
}

.common-tool-wrapper {
  display: flex;
  flex-direction: row;
}
</style>
