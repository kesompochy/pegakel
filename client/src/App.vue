<script setup lang="ts">
  import useAppMode from '~/composables/useAppMode'
  import useAppSheet from '~/composables/useAppSheet'
  const { currentMode, currentComponent, setMode } = useAppMode()
  import { modes } from '~/composables/consts'
  const { currentSheet, currentSpriteNumber, initSheetForTest } = useAppSheet()
  setMode(modes.SHEET_EDITOR)
  initSheetForTest()

  const handleChangeMode = (mode: typeof modes[keyof typeof modes], spriteId: number) => {
    setMode(mode)
    currentSpriteNumber.value = spriteId
  }
</script>

<template>
  <div>
    <h1>MODE: {{ currentMode }}</h1>
    <component 
      :is="currentComponent" 
      :sheet="currentSheet" 
      :sprite="currentSheet.sprites[currentSpriteNumber]"
      :spriteId="currentSpriteNumber"
      :handleChangeMode="handleChangeMode"
    /> 
  </div>
</template>

<style scoped lang="scss">
</style>
