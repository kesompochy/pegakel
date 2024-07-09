<script setup lang="ts">
  import useAppMode from '~/composables/useAppMode'
  import useAppSheet from '~/composables/useAppSheet'
  const { currentMode, currentComponent, setMode } = useAppMode()
  import { modes } from '~/composables/consts'
  const { currentSheet, currentSpriteId, initSheetForTest, currentSpriteGroupId, updateSheet } = useAppSheet()
  import SpriteGroup from '~/core/SpriteGroup';
  import Sprite from '~/core/Sprite';
  import SheetLogic from '~/logics/SheetLogic';
  setMode(modes.SPRITE_EDITOR)
  initSheetForTest()

  const handleChangeMode = (mode: typeof modes[keyof typeof modes], spriteId: number) => {
    setMode(mode)
    currentSpriteId.value = spriteId
  }
  const generateExportingString = (): string => {
    const exportingString = JSON.stringify(currentSheet.value)
    return exportingString
  }
  const exportSheet = () => {
    const exportingString = generateExportingString()
    console.log(exportingString)
  }
  const importSheet = () => {
    const importingString = prompt('Enter JSON string')
    if (importingString) {
      updateSheet(SheetLogic.importSheetFromJson(importingString))
      currentSpriteId.value = 0
      currentSpriteGroupId.value = 0
    }
  }
</script>

<template>
  <div>
    <h1>MODE: {{ currentMode }}</h1>
    <component 
      :is="currentComponent" 
      :sheet="currentSheet" 
      :sprite="currentSheet.sprites[currentSpriteId] as Sprite"
      :spriteId="currentSpriteId"
      :handleChangeMode="handleChangeMode"
      :spriteGroup="currentSheet.groups[currentSpriteGroupId] as SpriteGroup"
    /> 
    <button @click="exportSheet">Export</button>
    <button @click="importSheet">Import</button>
  </div>
</template>

<style scoped lang="scss">
</style>
