<script setup lang="ts">
import Sprite from "~/core/Sprite";

const props = defineProps<{
  sprites: Sprite[]
  clipSize: { width: number, height: number } | undefined
}>();
</script>

<template>
  <div>
    <canvas class="preview-animation" ref="animationCanvas" />
    <canvas v-for="(sprite, index) in props.sprites" ref="previewCanvas${index}" />
  </div>
</template>

<style scoped lang="scss">
</style>
