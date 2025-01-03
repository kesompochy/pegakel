<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ColorState from '~/core/ColorState'
import Sprite from '~/core/Sprite'
import { translateClickPositionToSpritePosition, registerCallbackCanvasPointerDownOrMove } from '~/utils/canvas'
import type Tool from '~/core/Tool'
import type { ManipulationMode } from '~/composables/SpriteEditor/useSpriteEditor'
import SpriteCanvas from '~/components/SpriteCanvas.vue'
import { useKeyHandler } from '~/composables/useKeyHandler'
import KeyMapConfig from '~/configs/actionKeyMap.json'

const manipulatingCell = ref({x: 0, y: 0})
const pushingDrawingKey = ref(false)
const pushingErasingKey = ref(false)

const props = defineProps<{
  sprite: Sprite | undefined, 
  activeColor: number | undefined,
  activeTool: Tool | undefined,
  manipulationMode: ManipulationMode | undefined,
  updateManipulationMode: (mode: ManipulationMode) => void, 
  updateSprite: (x: number, y: number, color: number) => void, 
  focused: boolean, 
  clipSize: {width: number, height: number} | undefined
  scale: number,
  palette: ColorState[],
  acceptKeyInput: boolean,
}>()

const editorActions: Partial<Record<keyof typeof KeyMapConfig, ()=>void>> = {
  'moveUp': () => {
    manipulatingCell.value = {x: manipulatingCell.value.x, y: Math.max(manipulatingCell.value.y - 1, 0)}
    if (pushingDrawingKey.value) (editorActions['draw'] as ()=>void)()
    if (pushingErasingKey.value) (editorActions['erase'] as ()=>void)()
  },
  'moveDown': () => {
    manipulatingCell.value = {x: manipulatingCell.value.x, y: Math.min(manipulatingCell.value.y + 1, (props.sprite?.height ?? 100000) - 1)}
    if (pushingDrawingKey.value) (editorActions['draw'] as ()=>void)()
    if (pushingErasingKey.value) (editorActions['erase'] as ()=>void)()
  },
  'moveLeft': () => {
    manipulatingCell.value = {x: Math.max(manipulatingCell.value.x - 1, 0), y: manipulatingCell.value.y}
    if (pushingDrawingKey.value) (editorActions['draw'] as ()=>void)()
    if (pushingErasingKey.value) (editorActions['erase'] as ()=>void)()
  },
  'moveRight': () => {
    manipulatingCell.value = {x: Math.min(manipulatingCell.value.x + 1, (props.sprite?.width ?? 10000) - 1), y: manipulatingCell.value.y}
    if (pushingDrawingKey.value) (editorActions['draw'] as ()=>void)()
    if (pushingErasingKey.value) (editorActions['erase'] as ()=>void)()
  },
  'draw': () => {
    if (props.activeColor == undefined) return
    if (!props.focused) return
    props.updateSprite(manipulatingCell.value.x, manipulatingCell.value.y, props.activeColor)
    pushingDrawingKey.value = true
  },
  'erase': () => {
    if (!props.focused) return
    props.updateSprite(manipulatingCell.value.x, manipulatingCell.value.y, 0)
    pushingErasingKey.value = true
  },
}
const handleKeyUp = (event: KeyboardEvent) => {
  if (KeyMapConfig['draw'].key === event.key) pushingDrawingKey.value = false
  if (KeyMapConfig['erase'].key === event.key) pushingErasingKey.value = false
}
onMounted(() => {
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('keydown', () => {
    props.updateManipulationMode('key')
  });
})
onUnmounted(() => {
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('keydown', () => {
    props.updateManipulationMode('key')
  });
})
useKeyHandler(editorActions, ()=>props.acceptKeyInput)

const drawManipulatingCell = (ctx: CanvasRenderingContext2D, pixelSizeWidth: number, pixelSizeHeight: number) => {
  if ( props.manipulationMode === 'key' && props.focused ) {
    const {x, y} = manipulatingCell.value
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(x * pixelSizeWidth, y * pixelSizeHeight, pixelSizeWidth, pixelSizeHeight)
  }
}
const drawClipRange = (ctx: CanvasRenderingContext2D, pixelSizeWidth: number, pixelSizeHeight: number, clipX: number, clipY: number) => {
  if (props.clipSize) {
    const {width, height} = props.clipSize
    ctx.strokeStyle = 'red'
    const lineWidth = 2
    ctx.lineWidth = lineWidth
    ctx.strokeRect(clipX * pixelSizeWidth, clipY * pixelSizeHeight, width * pixelSizeWidth, height * pixelSizeHeight)
  }
}
const afterDraw = (ctx: CanvasRenderingContext2D) => {
  if (!props.sprite) return
  const sprite = props.sprite
  const pixelSizeWidth = ctx.canvas.width / sprite.width
  const pixelSizeHeight = ctx.canvas.height / sprite.height
  drawManipulatingCell(ctx, pixelSizeWidth, pixelSizeHeight)
  drawClipRange(ctx, pixelSizeWidth, pixelSizeHeight, sprite.clipX, sprite.clipY)
}

const handleCanvasClick = (event: MouseEvent) => {
  const canvas = event.target as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (!props.sprite) return
  const sprite = props.sprite

  const {x, y} = translateClickPositionToSpritePosition(canvas, event, sprite.width, sprite.height)
  if (x === undefined || y === undefined) return
 
  let color;
  if (props.activeTool === "draw") {
    color = props.activeColor
  } else if (props.activeTool === "erase") {
    color = 0
  }
  color = color || 0
  props.updateSprite(x, y, color)

  props.updateManipulationMode('touch')
}

</script>

<template>
  <div class="sprite-canvas-canvas-container">
    <SpriteCanvas 
      :sprite="props.sprite" 
      :width="400 * props.scale/100" 
      :afterDraw="afterDraw"
      :propsForAfterDraw="{manipulatingCell: manipulatingCell, clipSize: props.clipSize}"
      :registerCallbackCanvasPointerDownOrMove="(canvas: HTMLCanvasElement) => {registerCallbackCanvasPointerDownOrMove(canvas, handleCanvasClick)}"
      :canvasPointerHandler="handleCanvasClick"
      :palette="props.palette"
    />
  </div>
</template>

<style scoped lang="scss">
div.sprite-canvas-canvas-container {
  width: 100%;
  height: 800px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-items: center;
}
</style>
