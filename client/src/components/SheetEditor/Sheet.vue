<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import Sheet from '~/core/Sheet'
import Sprite from '~/core/Sprite'
import * as canvasUtils from '~/utils/canvas'

const props = defineProps<{ sheet: Sheet }>()

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

const drawSheet = (ctx: CanvasRenderingContext2D, sheet: Sheet) => {
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
    ctx.drawImage(canvas, index, index)
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
</style>
