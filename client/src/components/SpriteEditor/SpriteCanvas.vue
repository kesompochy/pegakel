<script setup lang="ts">
import { onMounted, ref, defineProps } from 'vue'
import ColorState from '~/core/ColorState'
import useSpriteCanvas from '~/composables/SpriteEditor/useSpriteCanvas'
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
  const dpr = window.devicePixelRatio || 1
  const pixelSizeWidth = ctx.canvas.width / props.width
  const pixelSizeHeight = ctx.canvas.height / props.height
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  sprite.value.pixels.map((row, y) => {
    row.map((color, x) => {
      ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')'
      const drawX = Math.round(x * pixelSizeWidth)
      const drawY = Math.round(y * pixelSizeHeight)
      const drawWidth = Math.round((x + 1) * pixelSizeWidth) - drawX
      const drawHeight = Math.round((y + 1) * pixelSizeHeight) - drawY
      ctx.fillRect(drawX, drawY, drawWidth, drawHeight)
    })
  })
}

const resizeCanvas = (canvas: HTMLCanvasElement) => {
  if (!props.width || !props.height) return
  const dpr = window.devicePixelRatio || 1
  const styleWidth = parseFloat(window.getComputedStyle(canvas).getPropertyValue('width'))
  const aspectRatio = props.height / props.width
  const styleHeight = styleWidth * aspectRatio
  canvas.style.height = styleHeight + 'px'
  canvas.width = styleWidth * dpr
  canvas.height = styleHeight * dpr
}

const applyColorChange = (x: number, y: number, color: ColorState, canvas: HTMLCanvasElement) => {
  updateSprite(x, y, color)
  const ctx = canvas.getContext('2d')
  if(ctx){
    redraw(ctx)
  }
}


const handleCanvasClick = (event: MouseEvent) => {
  const canvas = canvasRef.value
  if (!canvas) return
  if (!props.width || !props.height) return
  const dpr = window.devicePixelRatio || 1

  const canvasRect = canvas.getBoundingClientRect()
  const canvasStyle = window.getComputedStyle(canvas)
  const borderWidthLeft = parseFloat(canvasStyle.borderLeftWidth)
  const borderWidthTop = parseFloat(canvasStyle.borderTopWidth)

  const paddingLeft = parseFloat(canvasStyle.paddingLeft)
  const paddingTop = parseFloat(canvasStyle.paddingTop)

  const canvasLeft = canvasRect.left + borderWidthLeft + paddingLeft
  const canvasTop = canvasRect.top + borderWidthTop + paddingTop
  const pixelSizeWidth = canvas.width / props.width
  const pixelSizeHeight = canvas.height / props.height
  const x = Math.floor((event.clientX - canvasLeft) / pixelSizeWidth * dpr)
  const y = Math.floor((event.clientY - canvasTop) / pixelSizeHeight * dpr)
  
  applyColorChange(x, y, new ColorState(255, 0, 0, 255), canvas)
}

onMounted(() => {
  if (!canvasRef.value) return
  resizeCanvas(canvasRef.value)

  if (!props.width || !props.height) return

  const ctx = canvasRef.value?.getContext('2d')
  if(ctx){
    redraw(ctx)
    const canvas = ctx.canvas
    canvas.onpointerdown = (e: MouseEvent) => {
      handleCanvasClick(e)
      canvas.onpointermove = (e: MouseEvent) => {
        handleCanvasClick(e)
      }
      canvas.onpointerup = () => {
        ctx.canvas.onpointermove = null
      }
      canvas.onpointerleave = () => {
        document.onpointerup = () => {
          canvas.onpointermove = null
        }
        canvas.onpointerenter = () => {
          window.onpointerup = null
          canvas.onpointerleave = null
        }
      }
    }
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
