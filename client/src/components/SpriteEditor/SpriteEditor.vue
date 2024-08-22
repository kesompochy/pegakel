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
  import { ref } from 'vue'

  import { defineProps, onMounted, onUnmounted } from 'vue'
  const props = defineProps<{
    sprite: Sprite | undefined,
    handleChangeMode: (mode: string, spriteId: number) => void,
    spriteId: number,
    spriteGroup: SpriteGroup, 
    updateSprite: (x: number, y: number, color: ColorState) => void,
  }>();
  const { activeColor, updateActiveColor, activeTool, updateActiveTool, manipulationMode, updateManipulationMode, canvasManipulatingCell, } = useSpriteEditor()

  const ComponentName = ['canvas', 'palette'] as const
  const focusingComponent = ref<number>(0)

  const goToSheetEditor = () => {
    props.handleChangeMode(modes.SHEET_EDITOR, props.spriteId)
  }
  const activateColor = (cellId: number) => {
    updateActiveColor(cellId) 
  }
  const updatePalette = (color: ColorState, cellId: number) => {
    SpriteGroupLogic.updatePalette(props.spriteGroup, cellId, color)
  }

  const keyActionMap: Record<string, string> = {
    "n": "changeMode",
  }
  const manipulatorActions: Record<string, ()=>void> = {
    "changeMode": () => {
      focusingComponent.value = (focusingComponent.value + 1) % ComponentName.length 
    }
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key in keyActionMap) {
      manipulatorActions[keyActionMap[event.key]]()
    }
  }
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })


</script>

<template>
  <div>
    <SpriteCanvas 
      :width="props.sprite?.width || 0" 
      :height="props.sprite?.height || 0" 
      :sprite="props.sprite"
      :activeColorState="props.spriteGroup.palette[activeColor]"
      :activeTool="activeTool"
      :manipulationMode="manipulationMode"
      :updateManipulationMode="updateManipulationMode"
      :manipulatingCell="canvasManipulatingCell"
      :updateSprite="props.updateSprite"
      :focused="focusingComponent === 0"
    />
    <Palette 
      :colors="props.spriteGroup.palette" 
      :handleChoosePaletteCell="activateColor"
      :activeColor="activeColor"
      :handleUpdatePalette="updatePalette"
      :focused="focusingComponent === 1"
      />
    <ToolBox
      :activeTool="activeTool"
      :handleChangeTool="updateActiveTool"
    />
    <button @click="goToSheetEditor">Go to Sheet Editor</button>
  </div>
</template>

<style lang="scss">
canvas{
  border: 1px solid black;
}
</style>
