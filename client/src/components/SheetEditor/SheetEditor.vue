<script setup lang="ts">
  import SheetComponent from './Sheet.vue'
  import Sheet from '~/core/Sheet'
  import useSheet from '~/composables/SheetEditor/useSheet'
  import { modes } from '~/composables/consts'

  import { defineProps } from 'vue'
  const props = defineProps<{ sheet: Sheet, handleChangeMode: Function }>()

  const { focusedSprite, updateFocusedSprite } = useSheet()
  
  const proceedFocusedSprite = () => {
    updateFocusedSprite((focusedSprite.value + 1) % props.sheet.sprites.length)
  }
  const changeModeToSpriteEditor = () => {
    props.handleChangeMode(modes.SPRITE_EDITOR, focusedSprite.value)
  }
</script>
<script lang="ts">
  export default {
    inheritAttrs: false
  }
</script>

<template>
  <SheetComponent :sheet="props.sheet" :focusedSprite="focusedSprite"/>
  <button @click="proceedFocusedSprite()">Next</button>
  <button @click="changeModeToSpriteEditor()">Edit</button>
</template>

<style scoped lang="scss">
</style>
