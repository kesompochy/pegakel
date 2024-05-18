<script setup lang="ts">
  import SheetComponent from './Sheet.vue'
  import Sheet from '~/core/Sheet'
  import useSheet from '~/composables/SheetEditor/useSheet'

  import { defineProps } from 'vue'
  const props = defineProps<{ sheet: Sheet }>()

  const { focusedSprite } = useSheet()
</script>

<template>
  <SheetComponent :sheet="props.sheet" :focusedSprite="focusedSprite"/>
</template>

<style scoped lang="scss">
</style>
