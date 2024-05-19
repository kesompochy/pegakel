<script setup lang="ts">
  import SheetComponent from './Sheet.vue'
  import Sheet from '~/core/Sheet'
  import useSheet from '~/composables/SheetEditor/useSheet'

  import { defineProps, onMounted } from 'vue'
  const props = defineProps<{ sheet: Sheet }>()

  const { focusedSprite, updateFocusedSprite } = useSheet()
  
  const proceedFocusedSprite = () => {
    console.log(focusedSprite.value, props.sheet.sprites.length, focusedSprite.value + 1, (focusedSprite.value + 1) % props.sheet.sprites.length)
    updateFocusedSprite((focusedSprite.value + 1) % props.sheet.sprites.length)
    console.log(focusedSprite.value)
  }
  onMounted(() => {
    
    proceedFocusedSprite()
  })    
</script>
<script lang="ts">
  export default {
    inheritAttrs: false
  }
</script>

<template>
  <SheetComponent :sheet="props.sheet" :focusedSprite="focusedSprite"/>
  <button @click="proceedFocusedSprite()">Next</button>
</template>

<style scoped lang="scss">
</style>
