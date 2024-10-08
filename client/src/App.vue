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
  import ColorState from '~/core/ColorState';
  import SpriteGroupLogic from '~/logics/SpriteGroupLogic';
  import Preview from './components/Preview.vue';
  import Help from './components/Help.vue';
  import SheetLogic from '~/logics/SheetLogic';
  import KeyMapConfig from '~/configs/actionKeyMap.json'
  setMode(modes.SPRITE_EDITOR)
  const scale = ref<number>(100)

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"
  const FILE_NAME = import.meta.env.VITE_FILE_NAME || "default"
  setFileName(FILE_NAME)

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
    if ('error' in response) {
      console.error(response.error)
    }
  }
  const exportAsGif = async () => {
    const sprites = SheetLogic.getClippedSpritesInGroup(currentSheet.value, currentSpriteGroupId.value)
    const response = await jsonRpcClient.call('exportGroup', { 
      format: 'gif',
      sprites: sprites,
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


  const updateSprite = (x: number, y: number, color: ColorState) => {
    SpriteLogic.updateSprite(currentSheet.value.sprites[currentSpriteId.value], { x, y, color } )
  }
  const updateSpriteSize = (left: number, top: number, bottom: number, right: number) => {
    SpriteLogic.updateSpriteSize(currentSheet.value.sprites[currentSpriteId.value], left, top, bottom, right)
  }

  type ManipulationAction = "goToSheetEditor"
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
  <div>
    <div class="app-container">
      <span class="scale">{{ scale }}%</span>
      <div class="editor-container">
        <button @click="newSheet">New</button>
        <button @click="openFile">Open</button>
        <button @click="exportSheet">Export</button>
        <input v-model="fileName" />
        <p class="file-name">{{ fileName }}</p>
        <button @click="save">Save</button>
        <button @click="exportAsGif">Export as Gif</button>
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
        />
      </div> 
      <Preview
          :sprites="clippedSpritesForPreview"
          :name="currentSheet.groups[currentSpriteGroupId].name"
          :updateGroupName="(name: string) => {SpriteGroupLogic.updateName(currentSheet.groups[currentSpriteGroupId], name)}"
      />
      <Help :keyActionMap="KeyMapConfig"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-container{
  display: flex;
  flex-direction: row;
  gap: 20px;
  .file-name {
    width: 500px;
  }
}

</style>
