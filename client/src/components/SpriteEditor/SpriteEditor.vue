<script setup lang="ts">
  import Palette from './Palette.vue'
  import SpriteCanvas from './SpriteCanvas.vue'
  import ToolBox from './ToolBox.vue'
  import Sprite from '~/core/Sprite'
  import { modes } from '~/composables/consts'
  import SpriteGroup from '~/core/SpriteGroup'
  import useSpriteEditor from '~/composables/SpriteEditor/useSpriteEditor'
  import SpriteGroupLogic from '~/logics/SpriteGroupLogic'
  import ColorState from '~/core/ColorState'

  import { defineProps } from 'vue'
  const props = defineProps<{
    sprite: Sprite,
    handleChangeMode: Function,
    spriteId: number,
    spriteGroup: SpriteGroup,
  }>()
  const { activeColor, updateActiveColor, activeTool, updateActiveTool, manipulationMode, updateManipulationMode } = useSpriteEditor()

  const goToSheetEditor = () => {
    props.handleChangeMode(modes.SHEET_EDITOR, props.spriteId)
  }
  const activateColor = (cellId: number) => {
    updateActiveColor(cellId) 
  }
  const updatePalette = (color: ColorState, cellId: number) => {
    SpriteGroupLogic.updatePalette(props.spriteGroup, cellId, color)
  }
</script>

<template>
  <SpriteCanvas 
    :width="props.sprite?.width || 0" 
    :height="props.sprite?.height || 0" 
    :sprite="props.sprite"
    :activeColorState="props.spriteGroup.palette[activeColor]"
    :activeTool="activeTool"
    :manipulationMode="manipulationMode"
    :updateManipulationMode="updateManipulationMode"
  />
  <Palette 
    :colors="props.spriteGroup.palette" 
    :handleChoosePaletteCell="activateColor"
    :activeColor="activeColor"
    :handleUpdatePalette="updatePalette"
    />
  <ToolBox
    :activeTool="activeTool"
    :handleChangeTool="updateActiveTool"
  />
  <button @click="goToSheetEditor">Go to Sheet Editor</button>
</template>

<style lang="scss">
canvas{
  border: 1px solid black;
}
</style>
