<script setup lang="ts">
  import { JsonRpcClient } from 'bunson';
  import useAppMode from '~/composables/useAppMode'
  import useAppSheet from '~/composables/useAppSheet'
  import { onMounted, onUnmounted } from 'vue'
  const { currentComponent, setMode } = useAppMode()
  import { modes } from '~/composables/consts'
  const { currentSheet, currentSpriteId, initSheetForTest, currentSpriteGroupId, updateSheet, fileName, setFileName } = useAppSheet()
  import SpriteGroup from '~/core/SpriteGroup';
  import Sprite from '~/core/Sprite';
  import Sheet from '~/core/Sheet';
  import SpriteLogic from '~/logics/SpriteLogic';
  import ColorState from '~/core/ColorState';
  setMode(modes.SPRITE_EDITOR)

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
    methods: ['save', 'load'],
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
        localPath: fileName.value
      }
    }, 0)
    if ('error' in response) {
      console.error(response.error)
    }
  }

  const openFile = async () => {
    const response = await jsonRpcClient.call('load', {     
      saveMode: 'local',
      localPath: fileName.value
    }, 0)
    if ('result' in response && response.result) {
      updateSheet(response.result as Sheet)
      currentSpriteId.value = 0
      currentSpriteGroupId.value = 0
    } else if ('error' in response) {
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
  const keyActionMap: Record<string, ManipulationAction> = {
    "Escape": "goToSheetEditor",
  }
  const manipulationActions: Record<ManipulationAction, () => void> = {
    "goToSheetEditor": () => {
      setMode(modes.SHEET_EDITOR)
    }
  }
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key in keyActionMap) {
      manipulationActions[keyActionMap[e.key]]()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', (e) => {
      handleKeyDown(e)
    });
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', (e) => {
      handleKeyDown(e)
    });
  })
</script>

<template>
  <div>
  <p class="file-name">{{ fileName }}</p>
    <component 
      :is="currentComponent" 
      :sheet="currentSheet" 
      :sprite="currentSheet.sprites[currentSpriteId] as Sprite"
      :spriteId="currentSpriteId"
      :handleChangeMode="handleChangeMode"
      :spriteGroup="currentSheet.groups[currentSpriteGroupId] as SpriteGroup"
      :updateSprite="updateSprite"
      :updateSpriteSize="updateSpriteSize"
    /> 
    <button @click="save">Save</button>
  </div>
</template>

<style scoped lang="scss">
.file-name {
  width: 500px;
}
</style>
