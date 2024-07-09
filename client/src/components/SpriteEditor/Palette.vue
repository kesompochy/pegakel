<script setup lang="ts">
import { defineProps, computed, watchEffect, ref, watch } from 'vue';
import ColorState from '~/core/ColorState'
import ColorSelector from './ColorSelector.vue'

const props = defineProps<{
  colors: ColorState[];
  handleChoosePaletteCell: (cellId: number) => void;
  activeColor: number;
  handleUpdatePalette: (color: ColorState, cellId: number) => void;
}>();
const localColors = ref(props.colors)
watch(() => props.colors, (newColors: ColorState[]) => {
  localColors.value = newColors
}, { immediate: true, deep: true })
const colors = computed(() => {
  const colors = new Array(16).fill(null).map((_, index) => props.colors[index])
  return colors
});
const currentColor = computed(() => colors.value[props.activeColor] || new ColorState());
const generateCellStyle = (color: ColorState, index: number) => {
  const style = {
    backgroundColor: color ? color.hex : 'transparent',
    border: props.activeColor === index ? '2px solid black' : '1px solid black' 
  }
  console.log(`Cell ${index} style: ${JSON.stringify(style)}, color: ${JSON.stringify(color)}}`)
  return {
    backgroundColor: color ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` : 'transparent',
    border: props.activeColor === index ? '2px solid black' : '1px solid black' 
  }
}
</script>

<template>
  <div class="palette container">
    <div
      v-for="(color, index) in localColors"
      class="color-cell"
      :style="generateCellStyle(color as ColorState, index)"
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
  width: 100%;
  height: 100%;
}
</style>
