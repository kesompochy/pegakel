<script setup lang="ts">
  import useAppMode from '~/composables/useAppMode'
  import useAppSheet from '~/composables/useAppSheet'
  const { currentMode, currentComponent, setMode, modes } = useAppMode()
  const { currentSheet, currentSpriteNumber, initSheetForTest } = useAppSheet()
  setMode(modes.SHEET_EDITOR)
  initSheetForTest()
  console.log(currentSheet.value)
</script>

<template>
  <div>
    <h1>MODE: {{ currentMode }}</h1>
    <component :is="currentComponent" :sheet="currentSheet" :sprite="currentSheet.sprites[currentSpriteNumber]"/>
  </div>
</template>

<style scoped lang="scss">
</style>
