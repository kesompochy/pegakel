<script setup lang="ts">
import { ref } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
</script>

<template>
  <canvas></canvas>
</template>

<style scoped>
canvas {
  border: 1px solid #000;
}
</style>
