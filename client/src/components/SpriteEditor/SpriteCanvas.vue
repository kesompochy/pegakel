<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import ColorState from '~/core/ColorState'
import Sprite from '~/core/Sprite'
import { resizeCanvas, translateClickPositionToSpritePosition, registerCallbackCanvasPointerDownOrMove, drawPixel } from '~/utils/canvas'
const canvasRef = ref<HTMLCanvasElement | null>(null)
import type Tool from '~/core/Tool'
import type { ManipulationMode } from '~/composables/SpriteEditor/useSpriteEditor'

const manipulatingCell = ref({x: 0, y: 0})

const props = defineProps<{
  sprite: Sprite | undefined, 
  activeColorState: ColorState | undefined, 
  activeTool: Tool | undefined,
  manipulationMode: ManipulationMode | undefined,
  updateManipulationMode: (mode: ManipulationMode) => void, 
  updateSprite: (x: number, y: number, color: ColorState) => void, 
  focused: boolean, 
  clipSize: {width: number, height: number} | undefined
}>()

type EditorAction = 'moveUp' | 'moveDown' | 'moveLeft' | 'moveRight' | 'draw' | 'erase'
const keyActionMap: Record<string, EditorAction> = {
  'k': 'moveUp',
  'j': 'moveDown',
  'h': 'moveLeft',
  'l': 'moveRight',
  'x': 'erase',
  'a': 'draw'
}
const editorActions: Record<EditorAction, ()=>void> = {
  'moveUp': () => {
    manipulatingCell.value = {x: manipulatingCell.value.x, y: Math.max(manipulatingCell.value.y - 1, 0)}
  },
  'moveDown': () => {
    manipulatingCell.value = {x: manipulatingCell.value.x, y: Math.min(manipulatingCell.value.y + 1, (props.sprite?.height ?? 100000) - 1)}
  },
  'moveLeft': () => {
    manipulatingCell.value = {x: Math.max(manipulatingCell.value.x - 1, 0), y: manipulatingCell.value.y}
  },
  'moveRight': () => {
    manipulatingCell.value = {x: Math.min(manipulatingCell.value.x + 1, (props.sprite?.width ?? 10000) - 1), y: manipulatingCell.value.y}
  },
  'draw': () => {
    if (!props.activeColorState) return
    props.updateSprite(manipulatingCell.value.x, manipulatingCell.value.y, props.activeColorState)
    redraw()
  },
  'erase': () => {
    props.updateSprite(manipulatingCell.value.x, manipulatingCell.value.y, new ColorState(0, 0, 0, 0))
    redraw()
  },
}
const handleKeyDown = (event: KeyboardEvent) => {
  if ( props.focused && keyActionMap[event.key] ) editorActions[keyActionMap[event.key]]()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const redraw = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (!props.sprite) return
  const sprite = props.sprite
  if (!ctx) return
  const pixelSizeWidth = ctx.canvas.width / sprite.width
  const pixelSizeHeight = ctx.canvas.height / sprite.height
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  sprite.pixels.map((row, y) => {
    row.map((color, x) => {
      const colorString = `rgba(${color.r},${color.g},${color.b},${color.a})`
      drawPixel(ctx, x, y, pixelSizeWidth, pixelSizeHeight, colorString)
   })
  })
  if ( props.manipulationMode === 'key' && props.focused ) {
    const {x, y} = manipulatingCell.value
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(x * pixelSizeWidth, y * pixelSizeHeight, pixelSizeWidth, pixelSizeHeight)
  }

  if (props.clipSize) {
    const {width, height} = props.clipSize
    ctx.strokeStyle = 'red'
    const lineWidth = 2
    ctx.lineWidth = lineWidth
    ctx.strokeRect(props.sprite.clipX * pixelSizeWidth, props.sprite.clipY * pixelSizeHeight, width * pixelSizeWidth, height * pixelSizeHeight)
  }
}

watch(() => props.sprite, () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (!props.sprite) return
  const sprite = props.sprite
  registerCallbackCanvasPointerDownOrMove(canvas, handleCanvasClick)
  resizeCanvas(canvas, sprite.width, sprite.height)
  redraw()
}, {deep: true})

watch(() => manipulatingCell, () => {
  redraw()
}, {deep: true});
watch(() => props.manipulationMode, () => {
  redraw()
});
watch(() => props.focused, () => {
  redraw()
});
watch(() => props.clipSize, () => {
  redraw()
}, {deep: true});

const handleCanvasClick = (event: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (!props.sprite) return
  const sprite = props.sprite

  const {x, y} = translateClickPositionToSpritePosition(canvas, event, sprite.width, sprite.height)
  if (x === undefined || y === undefined) return
 
  let color;
  if (props.activeTool === "draw") {
    color = props.activeColorState 
  } else if (props.activeTool === "erase") {
    color = new ColorState(0, 0, 0, 0)
  }
  color = color || new ColorState(0, 0, 0, 1)
  props.updateSprite(x, y, color)

  props.updateManipulationMode('touch')
  
  redraw()
}

onMounted(() => {
  if (!canvasRef.value) return
  if (!props.sprite) return
  const sprite = props.sprite
  resizeCanvas(canvasRef.value, sprite.width, sprite.height)

  const ctx = canvasRef.value?.getContext('2d')
  if(ctx){
    redraw()
    const canvas = ctx.canvas
    registerCallbackCanvasPointerDownOrMove(canvas, handleCanvasClick)
  }
})

</script>

<template>
  <div class="canvas-container">
    <canvas ref="canvasRef"/>
  </div>
</template>

<style scoped lang="scss">
div.canvas-container {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 5px;
}
canvas {
  border: 1px solid black;
  width: 100%;
  height: 100%;
  background-image: url('~/assets/checkerboard.svg');
}
</style>
