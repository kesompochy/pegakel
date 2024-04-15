<script setup lang="ts">
  import SheetComponent from './Sheet.vue'
  import Sheet from '~/core/Sheet'

  import { defineProps } from 'vue'
  const props = defineProps<{ sheet: Sheet }>()

</script>

<template>
  <SheetComponent :sheet="props.sheet"/>
</template>

<style scoped lang="scss">
</style>
