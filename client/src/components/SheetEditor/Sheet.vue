<script setup lang="ts">
import { defineProps, onMounted } from 'vue'
import Sheet from '~/core/Sheet'

const props = defineProps<{ sheet: Sheet }>()
</script>

<template>
  <div class="sheet-container">
    <span>This is the sheet</span>
    <canvas id="sheet"></canvas>
  </div>
</template>

<style scoped lang="scss">
#sheet {
  width: 100%;
  height: 100%;
}
</style>
