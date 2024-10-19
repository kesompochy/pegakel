<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch, defineProps } from 'vue'
  import Sprite from '~/core/Sprite'
  import * as CanvasUtils from '~/utils/canvas'

  const props = defineProps<{ 
    sprite?: Sprite, 
    width: number,
    beforeDraw?: (ctx: CanvasRenderingContext2D) => void,
    afterDraw?: (ctx: CanvasRenderingContext2D) => void,
    onMounted?: (canvas: HTMLCanvasElement) => void,
    propsForBeforeDraw?: Record<string, any>,
    propsForAfterDraw?: Record<string, any>,
    registerCallbackCanvasPointerDownOrMove?: (canvas: HTMLCanvasElement, handler: Function) => void,
    canvasPointerHandler?: (e: PointerEvent) => void,
    focused?: boolean,
    same?: boolean,
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

    if (props.beforeDraw) props.beforeDraw(ctx)
    sprite.pixels.map((row, y) => {
      row.map((color, x) => {
        const colorString = `rgba(${color.r},${color.g},${color.b},${color.a})`
        CanvasUtils.drawPixel(ctx, x, y, pixelSizeWidth, pixelSizeHeight, colorString)
     })
    })
    if (props.afterDraw) props.afterDraw(ctx)
  }
  const handlePropsChange = () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value

    if (!props.sprite) return
    const sprite = props.sprite
    CanvasUtils.resizeCanvas(canvas, sprite.width, sprite.height)
    redraw()
  }
  const registerPointerCallback = () => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    if (!canvas.onpointerdown) {
      if (props.registerCallbackCanvasPointerDownOrMove && props.canvasPointerHandler) {
        props.registerCallbackCanvasPointerDownOrMove(canvas, props.canvasPointerHandler)
      }
    }
  }

  watch(() => props.sprite, () => {
    handlePropsChange()
    registerPointerCallback()
  }, {deep: true})
  watch(() => props.propsForAfterDraw, () => {
    handlePropsChange()
  }, {deep: true})
  watch(() => props.propsForBeforeDraw, () => {
    handlePropsChange()
  }, {deep: true})
  watch(() => props.width, () => {
    handlePropsChange()
  })

  onMounted(() => {
    handlePropsChange()
    registerPointerCallback()
  })
  onUnmounted(() => {
    if (!canvasRef.value) return
    const canvas = canvasRef.value
    canvas.onpointerdown = null
    canvas.onpointermove = null
  })
</script>

<template>
  <div class="sprite-canvas-wrapper">
    <canvas 
      ref="canvasRef" 
      :style="{ 
        width: `${props.width}px`,
      }"
    />
    <div 
      class="overlay-style"
      :class="{ 
        focused: props.focused,
        same: props.same,
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.sprite-canvas-wrapper {
  position: relative;
  width: fit-content;
  height: fit-content;
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
  &.focused {
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  }
  &.same {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
