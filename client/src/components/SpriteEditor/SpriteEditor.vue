<script setup lang="ts">
  import Palette from './Palette.vue'
  import SpriteCanvas from './SpriteCanvas.vue'
  import ToolBox from './ToolBox.vue'
  import Sprite from '~/core/Sprite'
  import { modes } from '~/composables/consts'

  import { defineProps } from 'vue'
  const props = defineProps<{sprite: Sprite, handleChangeMode: Function, spriteId: number}>()

  const goToSheetEditor = () => {
    props.handleChangeMode(modes.SHEET_EDITOR, props.spriteId)
  }
</script>

<template>
  <SpriteCanvas :width="props.sprite?.width || 0" :height="props.sprite?.height || 0" :sprite="props.sprite"/>
  <Palette/>
  <ToolBox/>
  <button @click="goToSheetEditor">Go to Sheet Editor</button>
</template>

<style lang="scss">
canvas{
  border: 1px solid black;
}
</style>
