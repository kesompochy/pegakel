<script setup lang="ts">
import { computed, ref } from 'vue';
import ColorState from '~/core/ColorState'
import ColorSelector from './ColorSelector.vue'
import colorStateLogic from '~/logics/ColorState'
import { useKeyHandler } from '~/composables/useKeyHandler';

const props = defineProps<{
  colors: ColorState[];
  handleChoosePaletteCell: (cellId: number) => void;
  activeColor: number;
  handleUpdatePalette: (color: ColorState, cellId: number) => void;
  focused: boolean;
}>();

const focusingCell = ref(0)
const col = ref(16)
const row = ref(4)
const selectingColor = ref(false)

const colors = computed(() => {
  const colors = new Array(Math.max(props.colors.length, 64)).fill(colorStateLogic.createEmptyColorState()).map((_, index) => props.colors[index])
  
  return colors
});
const generateCellStyle = (color: ColorState, index: number) => {
  return {
    backgroundColor: color ? colorStateLogic.getHex(color) : 'transparent',
    border: props.activeColor === index ? '3px solid black' : props.focused && focusingCell.value === index ? '2px solid black' : '1px solid black' 
  }
}

const keyActionMap: Record<string, string> = {
  "h": "moveLeft",
  "j": "moveDown",
  "k": "moveUp",
  "l": "moveRight",
  "a": "selectColor",
  "c": "changeColor",
}
const manipulatorActions: Record<string, ()=>void> = {
  "moveLeft": () => {
    if (props.focused) focusingCell.value = (focusingCell.value - 1 + props.colors.length) % props.colors.length
  },
  "moveRight": () => {
    if (props.focused) focusingCell.value = (focusingCell.value + 1) % props.colors.length
  },
  "moveUp": () => {
    if (props.focused) focusingCell.value = (focusingCell.value - col.value + props.colors.length) % props.colors.length
  },
  "moveDown": () => {
    if (props.focused) focusingCell.value = (focusingCell.value + col.value) % props.colors.length
  },
  "selectColor": () => {
    if (props.focused) props.handleChoosePaletteCell(focusingCell.value) 
  },
  "changeColor": () => {
    if (props.focused) selectingColor.value = true
  },
}
useKeyHandler(keyActionMap, manipulatorActions)

const confirmColor = (color: ColorState) => {
  props.handleUpdatePalette(color, focusingCell.value)
  selectingColor.value = false
}
</script>

<template class="palette">
  <div class="palette-container">
    <div
      v-for="(color, index) in colors"
      class="color-cell"
      :style="generateCellStyle(color as ColorState, index)"
      @click="props.handleChoosePaletteCell(index)"
    ></div>
  </div>
  <ColorSelector 
    v-show="selectingColor"
    :currentColor="props.colors[focusingCell]"
    :handleConfirmColor="color => confirmColor(color)"
    :focused="selectingColor"
  />
</template>

<style scoped lang="scss">
.palette-container{
  border: 1px solid black;
  display: grid;
  grid-template-columns: v-bind("'repeat(' + col + ', 1fr)'");
  grid-template-rows: v-bind("'repeat(' + row + ', 1fr)'");
  width: 500px;
  height: 120px;
}
.color-cell{
  margin: 2px;
  width: 20px;
  height: 20px;
}
</style>
