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
  import KeyMapConfig from '~/configs/actionKeyMap.json'

  import { nextTick, ref, watch } from 'vue'
  
  const props = defineProps<{
    sprite: Sprite | undefined,
    handleChangeMode: (mode: string, spriteId: number) => void,
    spriteId: number,
    spriteGroup: SpriteGroup, 
    updateSprite: (x: number, y: number, color: number) => void,
    updateSpriteSize: (left: number, top: number, bottom: number, right: number) => void,
    updateClipSize: (width: number, height: number) => void,
    groupSprites: Sprite[],
    palette: ColorState[],
    updatePalette: (color: ColorState, cellId: number) => void,
    scale: number,
    acceptKeyInput: boolean 
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
    props.updatePalette(color, cellId)
    updateActiveColor(cellId)
    focusingComponent.value = 'canvas'
  }

  const actionProcessMap: Partial<Record<keyof typeof KeyMapConfig, ()=>void>> = {
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
      } else if (focusingComponent.value === 'clip') {
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
  useKeyHandler(actionProcessMap, ()=>props.acceptKeyInput)
  
</script>

<template>
  <div class="sprite-editor-container">
    <div class="canvas-tool-container">
       <div class="sprite-editor-tools-container">
        <div class="canvas-size-container container">
          <span class="canvas-size-span">
          <input type="number" :disabled="focusingComponent!=='clip'" v-model="clipSizeWidth" ref="clipSizeInputWidthElement">
          ×
          <input type="number" :disabled="focusingComponent!=='clip'" v-model="clipSizeHeight">
          </span>
        </div>
        <ToolBox
          :activeTool="activeTool"
          :handleChangeTool="updateActiveTool"
          :handleGoToSheetEditor="goToSheetEditor"
        />
        <Palette 
          :colors="props.palette" 
          :handleChoosePaletteCell="activateColor"
          :activeColor="activeColor"
          :handleUpdatePalette="updatePalette"
          :focused="focusingComponent === 'palette'"
          :acceptKeyInput="props.acceptKeyInput"
        />
      </div>
        <div class="sprite-editor-canvas-container">
        <input type="number" v-model="canvasResizeDeltaTop"  class="top sprite-editor-resize-input"  v-show="focusingComponent === 'resize'" ref="inputElementTop">
        <input type="number" v-model="canvasResizeDeltaLeft" class="left sprite-editor-resize-input" v-show="focusingComponent === 'resize'" ref="inputElementLeft">
        <SpriteCanvas 
          :width="props.sprite?.width || 0" 
          :height="props.sprite?.height || 0" 
          :sprite="props.sprite"
          :activeColor="activeColor"
          :activeTool="activeTool"
          :manipulationMode="manipulationMode"
          :updateManipulationMode="updateManipulationMode"
          :manipulatingCell="canvasManipulatingCell"
          :updateSprite="props.updateSprite"
          :focused="focusingComponent === 'canvas'"
          :clipSize="props.spriteGroup.clipSize"
          :scale="props.scale"
          :palette="props.palette"
                                                                                                                           :acceptKeyInput="props.acceptKeyInput"
          class="center"
        />
        <input type="number" v-model="canvasResizeDeltaRight"  class="right sprite-editor-resize-input"  v-show="focusingComponent === 'resize'" ref="inputElementRight">
        <input type="number" v-model="canvasResizeDeltaBottom" class="bottom sprite-editor-resize-input" v-show="focusingComponent === 'resize'" ref="inputElementBottom">
      </div>
   </div>
  </div>
</template>

<style lang="scss">
canvas{
  border: 1px solid black;
}

.sprite-editor-canvas-container {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: auto auto auto;
  gap: 2px;
  align-items: center;
  justify-items: center;

  width: fit-content;
  height: fit-content;

  margin: 5px;

  .top {
    grid-area: 1 / 2 / 2 / 3;
  }
  .left {
    grid-area: 2 / 1 / 3 / 2;
  }
  .right {
    grid-area: 2 / 3 / 3 / 4;
  }
  .bottom {
    grid-area: 3 / 2 / 4 / 3;
  }
  .center {
    grid-area: 2 / 2 / 3 / 3;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sprite-editor-resize-input {
    text-align: center;
    width: 100px;
  }

}

.canvas-tool-container {
  display: flex;
  flex-direction: row;
}
.sprite-editor-tools-container {
  width: 200px;
  margin: 5px;
}

.canvas-size-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  input {
    width: 50px;
  }
}

</style>
