<script setup lang="ts">
import { ref, onMounted } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
// 可能になったらcanvasを赤くする
onMounted(() => {
  if (canvas.value) {
    const ctx = canvas.value.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 100, 100);
    }
    canvas.value.addEventListener("click", (e) => {
      if (ctx) {
        handleClick(ctx, e);
      }
    });
  }
});

const handleClick = (ctx: CanvasRenderingContext2D, e: MouseEvent) => {
  ctx.fillStyle = "blue";
  ctx.fillRect(e.offsetX, e.offsetY, 10, 10);
};
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>

<style scoped>
canvas {
  border: 1px solid #000;
}
</style>
