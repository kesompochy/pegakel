<script setup lang="ts">
import { ref, onMounted } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.onClick = (e) => {
      console.log(e);
    };
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "red";
      ctx.fillRect(10, 10, 150, 100);
    }
  }
});
</script>

<template>
  <canvas></canvas>
</template>

<style scoped>
canvas {
  border: 1px solid #000;
}
</style>
