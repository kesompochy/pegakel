<script setup lang="ts">
import { onMounted, ref, defineProps } from 'vue'
import ColorState from '~/core/ColorState'
import useSpriteCanvas from '~/composables/SpriteEditor/useSpriteCanvas'
import { resizeCanvas, translateClickPositionToSpritePosition, registerCallbackCanvasPointerDownOrMove, drawPixel } from '~/utils/canvas'
const canvasRef = ref<HTMLCanvasElement | null>(null)

const props = defineProps({
  width: Number,
  height: Number,
})
const { sprite, updateSprite } = useSpriteCanvas(props)

const redraw = (ctx: CanvasRenderingContext2D) => {
  if (!sprite.value) return
  if (!ctx) return
  if (!props.width || !props.height) return
  const pixelSizeWidth = ctx.canvas.width / props.width
  const pixelSizeHeight = ctx.canvas.height / props.height
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  sprite.value.pixels.map((row, y) => {
    row.map((color, x) => {
      const colorString = `rgba(${color.r},${color.g},${color.b},${color.a})`
      drawPixel(ctx, x, y, pixelSizeWidth, pixelSizeHeight, colorString)
   })
  })
}

const handleCanvasClick = (event: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return
  if (!props.width || !props.height) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const {x, y} = translateClickPositionToSpritePosition(canvas, event, props.width, props.height)
  if (x === undefined || y === undefined) return

  updateSprite(x, y, new ColorState(255, 0, 0, 255))
  redraw(ctx)
}

onMounted(() => {
  if (!canvasRef.value) return
  if (!props.width || !props.height) return
  resizeCanvas(canvasRef.value, props.width, props.height)

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
