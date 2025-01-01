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
    } else if ('error' in response) {
      console.error(response.error)
    }
  }
  const newSheet = () => {
    const sheet = new Sheet("sheet")
    SheetLogic.addSprite(sheet)
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


  const updateSprite = (x: number, y: number, color: number) => {
    SpriteLogic.updateSprite(currentSheet.value.sprites[currentSpriteId.value], { x, y, color } )
  }
  const updateSpriteSize = (left: number, top: number, bottom: number, right: number) => {
    SpriteLogic.updateSpriteSize(currentSheet.value.sprites[currentSpriteId.value], left, top, bottom, right)
  }

  type ManipulationAction = "goToSheetEditor" | "zoomIn" | "zoomOut"
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
    }
  }
  useKeyHandler(manipulationActions)

  const updateClipSize = (width: number, height: number) => {
    SpriteGroupLogic.changeClipSize(currentSheet.value.groups[currentSpriteGroupId.value], {width, height})
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
          :updatePalette="(color, cellId) => {SheetLogic.updatePalette(currentSheet, color, cellId)}"
          :scale="scale"
          :acceptKeyInput="!focusingFileNameInput"
        />
      </div> 
      <div class="common-tool-wrapper">
        <Preview
            :sprites="clippedSpritesForPreview"
            :name="currentSheet.groups[currentSpriteGroupId].name"
            :updateGroupName="(name: string) => {SpriteGroupLogic.updateName(currentSheet.groups[currentSpriteGroupId], name)}"
            :palette="currentSheet.palette"
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
