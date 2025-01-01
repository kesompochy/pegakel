<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import ColorState from '~/core/ColorState'
import ColorSelector from './ColorSelector.vue'
import colorStateLogic from '~/logics/ColorState'
import { useKeyHandler } from '~/composables/useKeyHandler';
import KeyMapConfig from '~/configs/actionKeyMap.json';

const props = defineProps<{
  colors: ColorState[];
  handleChoosePaletteCell: (cellId: number) => void;
  activeColor: number;
  handleUpdatePalette: (color: ColorState, cellId: number) => void;
  focused: boolean;
  acceptKeyInput: boolean;
}>();

const focusingCell = ref(0)
const col = ref(4)
const row = ref(16)
const selectingColor = ref(false)
const containerRef = ref<HTMLDivElement | null>(null)

const cellSizePixel = 30
const calculateLayout = () => {
  if (!containerRef.value) return
  const width = containerRef.value.clientWidth
  const cellNum = 64;
  col.value = Math.floor(width / cellSizePixel)
  row.value = Math.ceil(cellNum / col.value)
}
const calculateSelectorPosition = computed(() => {
  const cellX = focusingCell.value % col.value * cellSizePixel
  const cellY = Math.floor(focusingCell.value / col.value) * cellSizePixel
  const selectorX = cellX + cellSizePixel
  const selectorY = cellY + cellSizePixel
  return {selectorX, selectorY}
});

onMounted(() => {
  calculateLayout()
  window.addEventListener('resize', calculateLayout)
})
onUnmounted(() => {
  window.removeEventListener('resize', calculateLayout)
})

const colors = computed(() => {
  const colors = new Array(Math.max(props.colors.length, 64)).fill(colorStateLogic.createEmptyColorState()).map((_, index) => props.colors[index])
  
  return colors
});
const generateCellStyle = (color: ColorState, index: number) => {
  return {
    backgroundColor: color ? colorStateLogic.getRgba(color) : 'transparent',
    border: props.activeColor === index ? '3px solid black' : props.focused && focusingCell.value === index ? '2px solid black' : '1px solid black' 
  }
}
const changeColor = () => {
  if (props.focused) selectingColor.value = true
}

const manipulatorActions: Partial<Record<keyof typeof KeyMapConfig, ()=>void>> = {
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
    changeColor()
  },
  "confirm": () => {
    console.log(selectingColor.value)
    if (props.focused) confirmColor(props.colors[focusingCell.value])
  }
}
useKeyHandler(manipulatorActions, () => props.acceptKeyInput)

const confirmColor = (color: ColorState) => {
  props.handleUpdatePalette(color, focusingCell.value)
  selectingColor.value = false
}
</script>

<template class="palette">
  <div class="palette-wrapper" ref="containerRef">
    <div class="palette-container container">
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
      :positionLeft="calculateSelectorPosition.selectorX"
      :positionTop="calculateSelectorPosition.selectorY"
      :acceptKeyInput="props.acceptKeyInput"
    />
  </div>
</template>

<style scoped lang="scss">
.palette-wrapper{
  position: relative;
}
.palette-container{
  display: grid;
  margin: 10px;
  grid-template-columns: v-bind("'repeat(' + col + ', 1fr)'");
  grid-template-rows: v-bind("'repeat(' + row + ', 1fr)'");
  aspect-ratio: v-bind("col / row");
}
.color-cell{
  aspect-ratio: 1;
  box-sizing: border-box;
}
</style>
