<script setup lang="ts">
import { defineProps, computed } from 'vue';
import ColorState from '~/core/ColorState'

const props = defineProps<{
  colors: ColorState[];
}>();

const colors: ColorState[] = new Array(16);

</script>

<template>
  <div class="palette container">
    <div
      v-for="color in colors"
      class="color-cell"
      :style="{backgroundColor: color ? color.hex : 'transparent'}"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.container{
  border: 1px solid black;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  width: 500px;
  height: 100px;
}
.color-cell{
  background-color: red;
  width: 100%;
  height: 100%;
  border: 1px solid black;
}
</style>
