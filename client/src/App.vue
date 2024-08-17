<script setup lang="ts">
  import { JsonRpcClient } from 'bunson';
  import useAppMode from '~/composables/useAppMode'
  import useAppSheet from '~/composables/useAppSheet'
  import { onMounted } from 'vue'
  const { currentComponent, setMode } = useAppMode()
  import { modes } from '~/composables/consts'
  const { currentSheet, currentSpriteId, initSheetForTest, currentSpriteGroupId, updateSheet, fileName, setFileName } = useAppSheet()
  import SpriteGroup from '~/core/SpriteGroup';
  import Sprite from '~/core/Sprite';
  import Sheet from '~/core/Sheet';
  setMode(modes.SPRITE_EDITOR)
  initSheetForTest()

  const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"
  const FILE_NAME = import.meta.env.VITE_FILE_NAME || "default"
  setFileName(FILE_NAME)

  onMounted(() => {
    openFile();
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
</script>

<template>
  <p class="file-name">{{ fileName }}</p>
  <div>
    <component 
      :is="currentComponent" 
      :sheet="currentSheet" 
      :sprite="currentSheet.sprites[currentSpriteId] as Sprite"
      :spriteId="currentSpriteId"
      :handleChangeMode="handleChangeMode"
      :spriteGroup="currentSheet.groups[currentSpriteGroupId] as SpriteGroup"
    /> 
    <button @click="save">Save</button>
  </div>
</template>

<style scoped lang="scss">
.file-name {
  width: 500px;
}
</style>
