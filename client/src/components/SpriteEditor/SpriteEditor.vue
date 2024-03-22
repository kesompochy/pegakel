<script setup lang="ts">
  import Palette from './Palette.vue'
  import SpriteCanvas from './SpriteCanvas.vue'
  import ToolBox from './ToolBox.vue'
  import Sprite from '~/core/Sprite'

  import { defineProps } from 'vue'
  const props = defineProps({
    sprite: Sprite
  })
</script>

<template>
  <SpriteCanvas :width="props.sprite?.width || 0" :height="props.sprite?.height || 0"/>
  <Palette/>
  <ToolBox/>
</template>

<style lang="scss">
canvas{
  border: 1px solid black;
}
</style>
