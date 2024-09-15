<script setup lang="ts">
  import { onMounted, ref, watch, defineProps } from 'vue'
  import Sprite from '~/core/Sprite'
  import * as CanvasUtils from '~/utils/canvas'

  const props = defineProps<{ 
    sprite?: Sprite, 
    width: number,
    border?: string,
    beforeDraw?: (ctx: CanvasRenderingContext2D) => void,
    afterDraw?: (ctx: CanvasRenderingContext2D) => void,
    onMounted?: (canvas: HTMLCanvasElement) => void,
    propsForBeforeDraw?: Record<string, any>,
    propsForAfterDraw?: Record<string, any>,
    registerCallbackCanvasPointerDownOrMove?: (canvas: HTMLCanvasElement, handler: Function) => void,
    canvasPointerHandler?: (e: PointerEvent) => void,
  }>()
  const canvasRef = ref<HTMLCanvasElement | null>(null)

  const redraw = () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (props.beforeDraw) props.beforeDraw(ctx)

    if (!props.sprite) return
    const sprite = props.sprite
    if (!ctx) return
    const pixelSizeWidth = ctx.canvas.width / sprite.width
    const pixelSizeHeight = ctx.canvas.height / sprite.height
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    sprite.pixels.map((row, y) => {
      row.map((color, x) => {
        const colorString = `rgba(${color.r},${color.g},${color.b},${color.a})`
        CanvasUtils.drawPixel(ctx, x, y, pixelSizeWidth, pixelSizeHeight, colorString)
     })
    })

    if (props.afterDraw) props.afterDraw(ctx)
  }

  watch(() => props.sprite, () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!canvas.onpointerdown) {
      if (props.registerCallbackCanvasPointerDownOrMove && props.canvasPointerHandler) {
        props.registerCallbackCanvasPointerDownOrMove(canvas, props.canvasPointerHandler)
      }
    }

    if (!props.sprite) return
    const sprite = props.sprite
    CanvasUtils.resizeCanvas(canvas, sprite.width, sprite.height)
    redraw()
  }, {deep: true})
  watch(() => props.propsForAfterDraw, () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!props.sprite) return
    const sprite = props.sprite
    CanvasUtils.resizeCanvas(canvas, sprite.width, sprite.height)
    redraw()
  }, {deep: true})
  watch(() => props.propsForBeforeDraw, () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!props.sprite) return
    const sprite = props.sprite
    CanvasUtils.resizeCanvas(canvas, sprite.width, sprite.height)
    redraw()
  }, {deep: true})
  watch(() => props.width, () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!props.sprite) return
    const sprite = props.sprite
    CanvasUtils.resizeCanvas(canvas, sprite.width, sprite.height)
    redraw()

    
  })

  onMounted(() => {
    if (!canvasRef.value) return
    if (!props.sprite) return
    const sprite = props.sprite
    CanvasUtils.resizeCanvas(canvasRef.value, sprite.width, sprite.height)

    const ctx = canvasRef.value?.getContext('2d')
    if(ctx){
      redraw()
      const canvas = canvasRef.value

      if (!canvas.onpointerdown) {
        if (props.registerCallbackCanvasPointerDownOrMove && props.canvasPointerHandler) {
          props.registerCallbackCanvasPointerDownOrMove(canvas, props.canvasPointerHandler)
        }
      }
    }
  })
</script>

<template>
  <div class="container">
    <canvas 
      ref="canvasRef" 
      :style="{ 
        width: `${props.width}px`,
      }"
    />
    <div 
      class="overlay-style"
      :style="{ 
        width: `${props.width}px`,
        border: props.border || 'none',
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  width: fit-content;
  margin: 5px;
}
canvas {
  border: none;
  background-image: url('~/assets/checkerboard.svg');
  display: block;
}
.overlay-style {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  box-sizing: border-box;
}
</style>
