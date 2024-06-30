<script setup lang="ts">
import { defineProps, computed } from 'vue';
import ColorState from '~/core/ColorState'
import ColorSelector from './ColorSelector.vue'

const props = defineProps<{
  colors: ColorState[];
  handleChoosePaletteCell: (cellId: number) => void;
  activeColor: number;
  handleUpdatePalette: (color: ColorState, cellId: number) => void;
}>();
const colors = computed(() => new Array(16).fill(null).map((_, index) => props.colors[index]));
const currentColor = computed(() => colors.value[props.activeColor] || new ColorState());
</script>

<template>
  <div class="palette container">
    <div
      v-for="(color, index) in colors"
      class="color-cell"
      :style="{
        backgroundColor: color ? color.hex : 'transparent',
        border: activeColor === index ? '2px solid black' : '1px solid black' 
      }"
      @click="props.handleChoosePaletteCell(index)"
    ></div>
  </div>
  <ColorSelector 
    :currentColor="currentColor" 
    :handleConfirmColor="color => props.handleUpdatePalette(color, activeColor)"
    />
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
