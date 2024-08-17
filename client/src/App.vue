<script setup lang="ts">
  import { JsonRpcClient } from 'bunson';
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

  const save = async () => {
    const client = new JsonRpcClient('http://localhost:3000', {
      methods: ['hello'],
      cors: 'cors'
    })
    const result = await client.call('hello', { name: 'world' }, 0)
    console.log(result)
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
    <button @click="save">Save</button>
  </div>
</template>

<style scoped lang="scss">
</style>
