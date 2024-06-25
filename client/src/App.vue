<script setup lang="ts">
  import useAppMode from '~/composables/useAppMode'
  import useAppSheet from '~/composables/useAppSheet'
  const { currentMode, currentComponent, setMode } = useAppMode()
  import { modes } from '~/composables/consts'
  const { currentSheet, currentSpriteId, initSheetForTest, currentSpriteGroupId } = useAppSheet()
  setMode(modes.SPRITE_EDITOR)
  initSheetForTest()

  const handleChangeMode = (mode: typeof modes[keyof typeof modes], spriteId: number) => {
    setMode(mode)
    currentSpriteId.value = spriteId
  }
  const exportSheet = () => {
    console.log(currentSheet)
  }
</script>

<template>
  <div>
    <h1>MODE: {{ currentMode }}</h1>
    <component 
      :is="currentComponent" 
      :sheet="currentSheet" 
      :sprite="currentSheet.sprites[currentSpriteId]"
      :spriteId="currentSpriteId"
      :handleChangeMode="handleChangeMode"
      :spriteGroup="currentSheet.groups[currentSpriteGroupId]"
    /> 
    <button @click="exportSheet">Export</button>
  </div>
</template>

<style scoped lang="scss">
</style>
