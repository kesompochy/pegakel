<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)

</script>

<template>
  <canvas></canvas>
</template>

<style scoped>
canvas {
  border: 1px solid #000;
}
</style>
