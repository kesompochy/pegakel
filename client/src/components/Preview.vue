<script setup lang="ts">
import Sprite from "~/core/Sprite";
import { onMounted, ref, watch, nextTick } from 'vue';
import * as CanvasUtils from '~/utils/canvas'

const animationCanvas = ref<HTMLCanvasElement | null>(null);
const drawingSpriteNumber = ref<number>(0);
const fps = ref<number>(5);
const animationRequest = ref<number | null>(null);

const props = defineProps<{
  sprites: Sprite[]
  clipSize: { width: number, height: number } | undefined
}>();

const redraw = (ctx: CanvasRenderingContext2D, sprite: Sprite) => {
  const pixelSizeWidth = ctx.canvas.width / sprite.width
  const pixelSizeHeight = ctx.canvas.height / sprite.height
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  
  sprite.pixels.map((row, y) => {
    row.map((color, x) => {
      const colorString = `rgba(${color.r},${color.g},${color.b},${color.a})`
      CanvasUtils.drawPixel(ctx, x, y, pixelSizeWidth, pixelSizeHeight, colorString)
   })
  })
}

const drawAnimationCanvas = (ctx: CanvasRenderingContext2D, id: number) => {
  if (id < 0 || id >= props.sprites.length) return;
  const sprite = props.sprites[id];
  if (!sprite) return;
  redraw(ctx, props.sprites[id]);
}

const animationCallback = (ctx: CanvasRenderingContext2D) => {
  if (props.sprites.length === 0) {
  } else {
   drawAnimationCanvas(ctx, drawingSpriteNumber.value | 0)
   drawingSpriteNumber.value = (drawingSpriteNumber.value + fps.value/60) % props.sprites.length
  }
  if (animationRequest.value) cancelAnimationFrame(animationRequest.value);
  animationRequest.value = requestAnimationFrame(()=>{animationCallback(ctx)});
}

const setupCanvases = () => {
  if (!animationCanvas.value) return;
  const ctx = animationCanvas.value.getContext("2d");
  if (!ctx) return;
  CanvasUtils.resizeCanvas(animationCanvas.value, props.clipSize?.width || 0, props.clipSize?.height || 0);

  if (animationRequest.value) cancelAnimationFrame(animationRequest.value);
  animationRequest.value = requestAnimationFrame(()=>{animationCallback(ctx)});

  props.sprites.map((sprite, index) => {
    const canvas = document.getElementById(`previewCanvas${index}`) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    CanvasUtils.resizeCanvas(canvas, props.clipSize?.width || 0, props.clipSize?.height || 0);
    redraw(ctx, sprite);
  });
}

onMounted(() => {
  setupCanvases();
});

watch(() => props.sprites, () => {
  nextTick(() => {
    setupCanvases();
  });
}, { deep: true });
watch(() => props.clipSize, () => {
  setupCanvases();
}, { deep: true });

const generateCanvasStyle = (index: number) => {
  return {
    border: (index === (drawingSpriteNumber.value | 0)) ? '2px solid red' : '2px solid black'
  }
}

</script>

<template>
  <div>
    <div class="container">
      <canvas class="preview-animation" ref="animationCanvas" />
      <canvas class="sprite-preview-canvas" v-for="(sprite, index) in props.sprites" :id="`previewCanvas${index}`" :style="generateCanvasStyle(index)"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; 

  canvas {
    max-width: 100%;
    height: auto;
  }
  .preview-animation {
    width: 200px;
  }
  .sprite-preview-canvas {
    width: 100px;
  }
}
</style>
