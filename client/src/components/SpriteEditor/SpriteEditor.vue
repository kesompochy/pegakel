<script setup lang="ts">
  import Palette from './Palette.vue'
  import SpriteCanvas from './SpriteCanvas.vue'
</script>

<template>
  <SpriteCanvas :width="32" :height="48"/>
  <Palette/>
</template>

<style lang="scss">
canvas{
  border: 1px solid black;
}
</style>
