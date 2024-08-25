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

  import { nextTick, onMounted, onUnmounted, ref } from 'vue'
  const props = defineProps<{
    sprite: Sprite | undefined,
    handleChangeMode: (mode: string, spriteId: number) => void,
    spriteId: number,
    spriteGroup: SpriteGroup, 
    updateSprite: (x: number, y: number, color: ColorState) => void,
    updateSpriteSize: (left: number, top: number, bottom: number, right: number) => void,
  }>();
  const { activeColor, updateActiveColor, activeTool, updateActiveTool, manipulationMode, updateManipulationMode, canvasManipulatingCell, } = useSpriteEditor()

  type focusableComponent = 'canvas' | 'palette' | 'resize'
  const focusingComponent = ref<focusableComponent>('canvas')
  const canvasResizeDeltaTop = ref(0)
  const canvasResizeDeltaLeft = ref(0)
  const canvasResizeDeltaRight = ref(0)
  const canvasResizeDeltaBottom = ref(0)
  const inputElementTop = ref<HTMLInputElement | null>(null)
  const inputElementLeft = ref<HTMLInputElement | null>(null)
  const inputElementRight = ref<HTMLInputElement | null>(null)
  const inputElementBottom = ref<HTMLInputElement | null>(null)

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
    "n": "switchFucsingComponent",
    "s": "changeModeToResize",
    "Enter": "confirm",
    "h": "moveLeft",
    "j": "moveDown",
    "k": "moveUp",
    "l": "moveRight",
  }
  const manipulatorActions: Record<string, ()=>void> = {
    "switchFucsingComponent": () => {
      focusingComponent.value = focusingComponent.value === 'canvas' ? 'palette' : 'canvas'
    },
    "changeModeToResize": async () => {
      focusingComponent.value = 'resize'
      await nextTick() // wait for the input element to be rendered
      inputElementTop.value?.focus()
    },
    "confirm": () => {
      if (focusingComponent.value === 'resize') {
        props.updateSpriteSize(
          canvasResizeDeltaLeft.value,
          canvasResizeDeltaTop.value,
          canvasResizeDeltaBottom.value,
          canvasResizeDeltaRight.value,
        )
        focusingComponent.value = 'canvas'
        canvasResizeDeltaTop.value = 0
        canvasResizeDeltaLeft.value = 0
        canvasResizeDeltaRight.value = 0
        canvasResizeDeltaBottom.value = 0
      }
    },
    "moveLeft": () => {
      if (focusingComponent.value === 'resize') {
        inputElementLeft.value?.focus()
      }
    },
    "moveDown": () => {
      if (focusingComponent.value === 'resize') {
        inputElementBottom.value?.focus()
      }
    },
    "moveUp": () => {
      if (focusingComponent.value === 'resize') {
        inputElementTop.value?.focus()
      }
    },
    "moveRight": () => {
      if (focusingComponent.value === 'resize') {
        inputElementRight.value?.focus()
      }
    },
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
    <div class="canvas-container">
      <input type="number" v-model="canvasResizeDeltaTop"  class="top"  v-show="focusingComponent === 'resize'" ref="inputElementTop">
      <input type="number" v-model="canvasResizeDeltaLeft" class="left" v-show="focusingComponent === 'resize'" ref="inputElementLeft">
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
        :focused="focusingComponent === 'canvas'"
        class="center"
      />
      <input type="number" v-model="canvasResizeDeltaRight"  class="right"  v-show="focusingComponent === 'resize'" ref="inputElementRight">
      <input type="number" v-model="canvasResizeDeltaBottom" class="bottom" v-show="focusingComponent === 'resize'" ref="inputElementBottom">
    </div>
    <Palette 
      :colors="props.spriteGroup.palette" 
      :handleChoosePaletteCell="activateColor"
      :activeColor="activeColor"
      :handleUpdatePalette="updatePalette"
      :focused="focusingComponent === 'palette'"
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

.canvas-container {
  display: grid;
  grid-template-areas:
    ".    top     ."
    "left canvas  right"
    ".     bottom ."
  ;
  .top {
    grid-area: top;
  }
  .left {
    grid-area: left;
  }
  .right {
    grid-area: right;
  }
  .bottom {
    grid-area: bottom;
  }
  .center {
    grid-area: canvas;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
