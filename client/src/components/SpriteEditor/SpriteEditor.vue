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
  import SpriteLogic from '~/logics/SpriteLogic'
  import { useKeyHandler } from '~/composables/useKeyHandler'

  import { nextTick, ref, watch } from 'vue'
  
  const props = defineProps<{
    sprite: Sprite | undefined,
    handleChangeMode: (mode: string, spriteId: number) => void,
    spriteId: number,
    spriteGroup: SpriteGroup, 
    updateSprite: (x: number, y: number, color: ColorState) => void,
    updateSpriteSize: (left: number, top: number, bottom: number, right: number) => void,
    updateClipSize: (width: number, height: number) => void,
    groupSprites: Sprite[],
  }>();
  const { activeColor, updateActiveColor, activeTool, updateActiveTool, manipulationMode, updateManipulationMode, canvasManipulatingCell, } = useSpriteEditor()

  type focusableComponent = 'canvas' | 'palette' | 'resize' | 'clip'
  const focusingComponent = ref<focusableComponent>('canvas')
  const canvasResizeDeltaTop = ref(0)
  const canvasResizeDeltaLeft = ref(0)
  const canvasResizeDeltaRight = ref(0)
  const canvasResizeDeltaBottom = ref(0)
  const inputElementTop = ref<HTMLInputElement | null>(null)
  const inputElementLeft = ref<HTMLInputElement | null>(null)
  const inputElementRight = ref<HTMLInputElement | null>(null)
  const inputElementBottom = ref<HTMLInputElement | null>(null)
  const clipSizeWidth = ref<number>(props.spriteGroup.clipSize?.width || 0)
  const clipSizeHeight = ref<number>(props.spriteGroup.clipSize?.height || 0)
  const clipSizeInputWidthElement = ref<HTMLInputElement | null>(null)

  const setSpriteGroupClipSize = () => {
    if (!props.spriteGroup.clipSize && props.sprite) {
      SpriteGroupLogic.changeClipSize(props.spriteGroup, {width: props.sprite.width, height: props.sprite.height})
    }
  }
  watch(props.spriteGroup, () => {
    setSpriteGroupClipSize()
  }, {deep: true})
  watch(() => props.sprite, () => {
    setSpriteGroupClipSize()
  }, {deep: true})
  watch(() => props.spriteGroup.clipSize, () => {
    clipSizeWidth.value = props.spriteGroup.clipSize?.width || 0
    clipSizeHeight.value = props.spriteGroup.clipSize?.height || 0
  }, {deep: true})

  const goToSheetEditor = () => {
    props.handleChangeMode(modes.SHEET_EDITOR, props.spriteId)
  }
  const activateColor = (cellId: number) => {
    updateActiveColor(cellId) 
    focusingComponent.value = 'canvas'
  }
  const updatePalette = (color: ColorState, cellId: number) => {
    SpriteGroupLogic.updatePalette(props.spriteGroup, cellId, color)
    updateActiveColor(cellId)
    focusingComponent.value = 'canvas'
  }

  const keyActionMap: Record<string, string> = {
    "n": "switchFucsingComponent",
    "s": "changeModeToResize",
    "c": "changeModeToClip",
    "Enter": "confirm",
    "h": "moveLeft",
    "j": "moveDown",
    "k": "moveUp",
    "l": "moveRight",
  }
  const actionProcessMap: Record<string, ()=>void> = {
    "switchFucsingComponent": () => {
      focusingComponent.value = focusingComponent.value === 'canvas' ? 'palette' : 'canvas'
    },
    "changeModeToResize": async () => {
      focusingComponent.value = 'resize'
      await nextTick() // wait for the input element to be rendered
      inputElementTop.value?.focus()
    },
    "changeModeToClip": async () => {
      if (focusingComponent.value === 'canvas') {
        focusingComponent.value = 'clip'
        await nextTick() // wait for the input element to be rendered
        clipSizeInputWidthElement.value?.focus()
      }
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
      if (focusingComponent.value === 'clip') {
        SpriteGroupLogic.changeClipSize(props.spriteGroup, {width: clipSizeWidth.value, height: clipSizeHeight.value})
        focusingComponent.value = 'canvas'
      }
    },
    "moveLeft": () => {
      if (focusingComponent.value === 'resize') {
        inputElementLeft.value?.focus()
      } else if (focusingComponent.value === 'clip') {
        if (!props.sprite) return
        SpriteLogic.changeClip(props.sprite, {x: props.sprite.clipX - 1, y: props.sprite.clipY})
      }
    },
    "moveDown": () => {
      if (focusingComponent.value === 'resize') {
        inputElementBottom.value?.focus()
      } else if (focusingComponent.value === 'clip') {
        if (!props.sprite) return
        SpriteLogic.changeClip(props.sprite, {x: props.sprite.clipX, y: props.sprite.clipY + 1})
      }
    },
    "moveUp": () => {
      if (focusingComponent.value === 'resize') {
        inputElementTop.value?.focus()
      } else if (focusingComponent.value === 'clip') {
        if (!props.sprite) return
        SpriteLogic.changeClip(props.sprite, {x: props.sprite.clipX, y: props.sprite.clipY - 1})
      }
    },
    "moveRight": () => {
      if (focusingComponent.value === 'resize') {
        inputElementRight.value?.focus()
      } else if (focusingComponent.value === 'clip') {
        if (!props.sprite) return
        SpriteLogic.changeClip(props.sprite, {x: props.sprite.clipX + 1, y: props.sprite.clipY})
      }
    },
  }
  useKeyHandler(keyActionMap, actionProcessMap)
  
</script>

<template>
  <div>
    <input type="number" :disabled="focusingComponent!=='clip'" v-model="clipSizeWidth" ref="clipSizeInputWidthElement">
    <input type="number" :disabled="focusingComponent!=='clip'" v-model="clipSizeHeight">
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
        :clipSize="props.spriteGroup.clipSize"
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
