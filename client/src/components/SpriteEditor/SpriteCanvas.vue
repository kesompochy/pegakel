<script setup lang="ts">
import { onMounted, ref, defineProps, PropType, watch } from 'vue'
import ColorState from '~/core/ColorState'
import Sprite from '~/core/Sprite'
import { resizeCanvas, translateClickPositionToSpritePosition, registerCallbackCanvasPointerDownOrMove, drawPixel } from '~/utils/canvas'
import spriteLogic from '~/logics/SpriteLogic'
const canvasRef = ref<HTMLCanvasElement | null>(null)
import type Tool from '~/core/Tool'

const props = defineProps({
  sprite: Sprite,
  activeColorState: ColorState,
  activeTool: String as PropType<Tool>
})

const redraw = (ctx: CanvasRenderingContext2D) => {
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
}

watch(() => props.sprite, () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  redraw(ctx)
})

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
  
  redraw(ctx)
}

onMounted(() => {
  if (!canvasRef.value) return
  if (!props.sprite) return
  const sprite = props.sprite
  resizeCanvas(canvasRef.value, sprite.width, sprite.height)

  const ctx = canvasRef.value?.getContext('2d')
  if(ctx){
    redraw(ctx)
    const canvas = ctx.canvas
    registerCallbackCanvasPointerDownOrMove(canvas, handleCanvasClick)
  }
})
</script>

<template>
  <canvas ref="canvasRef"/>
</template>

<style scoped lang="scss">
canvas{
  border: 1px solid black;
  width: 400px;
}
</style>
