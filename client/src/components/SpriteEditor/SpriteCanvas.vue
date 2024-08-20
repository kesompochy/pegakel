<script setup lang="ts">
import { onMounted, ref, defineProps, PropType, watch } from 'vue'
import ColorState from '~/core/ColorState'
import Sprite from '~/core/Sprite'
import { resizeCanvas, translateClickPositionToSpritePosition, registerCallbackCanvasPointerDownOrMove, drawPixel } from '~/utils/canvas'
import spriteLogic from '~/logics/SpriteLogic'
const canvasRef = ref<HTMLCanvasElement | null>(null)
import type Tool from '~/core/Tool'
import type { ManipulationMode } from '~/composables/SpriteEditor/useSpriteEditor'

const manipulatingCell = ref<{x: number, y: number}>({x: 0, y: 0})

const props = defineProps({
  sprite: {
    type: Sprite,
    required: true,
  },
  activeColorState: {
    type: ColorState,
    required: true,
  },
  activeTool: String as PropType<Tool>,
  manipulationMode: String as PropType<ManipulationMode>,
  updateManipulationMode: {
    type: Function as PropType<(mode: ManipulationMode) => void>,
    required: true,
  }
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
  if ( props.manipulationMode === 'key' ) {
    const {x, y} = manipulatingCell.value
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(x * pixelSizeWidth, y * pixelSizeHeight, pixelSizeWidth, pixelSizeHeight)
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
})

watch(() => manipulatingCell, () => {
  redraw()
}, {deep: true});
watch(() => props.manipulationMode, () => {
  redraw()
});

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
  spriteLogic.updateSprite(props.sprite, {x: x, y: y, color: new ColorState(color.r, color.g, color.b, color.a)})

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

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    props.updateManipulationMode('key')
    console.log('key')
  }
  if (event.key === 'h') {
    manipulatingCell.value = {x: manipulatingCell.value.x - 1, y: manipulatingCell.value.y}
  }
  if (event.key === 'j') {
    manipulatingCell.value = {x: manipulatingCell.value.x, y: manipulatingCell.value.y + 1}
  }
  if (event.key === 'k') {
    manipulatingCell.value = {x: manipulatingCell.value.x, y: manipulatingCell.value.y - 1}
  }
  if (event.key === 'l') {
    manipulatingCell.value = {x: manipulatingCell.value.x + 1, y: manipulatingCell.value.y}
  }
  if (event.key === 'a') {
    const color = props.activeColorState
    spriteLogic.updateSprite(props.sprite, {x: manipulatingCell.value.x, y: manipulatingCell.value.y, color: new ColorState(color.r, color.g, color.b, color.a)})
    redraw()
  }
  if (event.key === 'x') {
    spriteLogic.updateSprite(props.sprite, {x: manipulatingCell.value.x, y: manipulatingCell.value.y, color: new ColorState(0, 0, 0, 0)})
    redraw()
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
}
canvas {
  border: 1px solid black;
  width: 100%;
  height: 100%;
  background-image: url('~/assets/checkerboard.svg');
}
</style>
