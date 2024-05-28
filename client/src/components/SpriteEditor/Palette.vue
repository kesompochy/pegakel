<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  color: string;
}>();
</script>

<template>
  <div class="palette container"><p>This is the Palette</p></div>
</template>

<style scoped lang="scss">
.container{
  border: 1px solid black;
}
</style>
