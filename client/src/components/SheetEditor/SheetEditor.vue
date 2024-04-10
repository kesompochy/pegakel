<script setup lang="ts">
  import SheetComponent from './Sheet.vue'
  import Sheet from '~/core/Sheet'

  import { defineProps, onMounted } from 'vue'
  const props = defineProps<{ sheet: Sheet }>()

  onMounted(() => {
    console.log('SheetEditor mounted')
  })
</script>

<template>
  <SheetComponent :sheet="props.sheet"/>
</template>

<style scoped lang="scss">
</style>
