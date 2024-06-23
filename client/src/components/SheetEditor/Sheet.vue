<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue'
import Sheet from '~/core/Sheet'

const props = defineProps<{ sheet: Sheet, focusedSprite: number }>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  drawSheet(ctx, props.sheet)
})

watch(() => props.sheet, () => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  drawSheet(ctx, props.sheet)
})
watch(() => props.focusedSprite, () => {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }

  drawSheet(ctx, props.sheet)
})

const drawSheet = (ctx: CanvasRenderingContext2D, sheet: Sheet) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  const sprites = sheet.sprites
  const canvases = sprites.map(sprite => {
    return document.createElement('canvas')
  })
  canvases.forEach((canvas, index) => {
    const sprite = sprites[index]
    canvas.width = sprite.width
    canvas.height = sprite.height
    const spriteCtx = canvas.getContext('2d')
    if (!spriteCtx) {
      return
    }
    sprite.pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        spriteCtx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        spriteCtx.fillRect(x, y, 1, 1)
      })
    })
  })
  canvases.forEach((canvas, index) => {
    const left = index * canvas.width
    const top = 0 
    ctx.drawImage(canvas, left, top)
    if ( props.focusedSprite === index ) {
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.strokeRect(left, top, canvas.width, canvas.height)
    }
  })
}
</script>

<template>
  <div class="sheet-container">
    <span>This is the sheet</span>
    <canvas id="sheet" ref="canvasRef"></canvas>
  </div>
</template>

<style scoped lang="scss">
#sheet {
  width: 100%;
  height: 100%;
}
.debug {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  padding: 1rem;
}
</style>
