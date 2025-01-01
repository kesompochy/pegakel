<script setup lang="ts">
import { computed, ref } from 'vue';
import ColorState from '~/core/ColorState'
import ColorSelector from './ColorSelector.vue'
import colorStateLogic from '~/logics/ColorState'
import { useKeyHandler } from '~/composables/useKeyHandler';
import KeyMapConfig from '~/configs/actionKeyMap.json';

const props = defineProps<{
  colors: ColorState[];
  handleChoosePaletteCell: (cellId: number) => void;
  activeColor: number;
  handleUpdatePalette: (color: ColorState | null, cellId: number) => void;
  focused: boolean;
  acceptKeyInput: boolean;
}>();

const focusingCell = ref(0)
const selectingColor = ref(false)
const containerRef = ref<HTMLDivElement | null>(null)

const cellSizePixel = 30

const generateCellStyle = (color: ColorState, index: number) => {
  return {
    backgroundColor: color ? colorStateLogic.getRgba(color) : 'transparent',
    border: props.activeColor === index ? '2.5px solid black' : props.focused && focusingCell.value === index ? '2px solid black' : '1px solid black' 
  }
}
const getCellsPerRow = () => {
  return Math.floor((containerRef.value?.clientWidth || cellSizePixel) / cellSizePixel) || 1
}

const calculateSelectorPosition = computed(() => {
  const cellsPerRow = getCellsPerRow()
  const cellX = focusingCell.value % cellsPerRow * cellSizePixel
  const cellY = Math.floor(focusingCell.value / cellsPerRow) * cellSizePixel
  const selectorX = cellX + cellSizePixel
  const selectorY = cellY + cellSizePixel
  return {selectorX, selectorY}
});

const manipulatorActions: Partial<Record<keyof typeof KeyMapConfig, ()=>void>> = {
  "moveLeft": () => {
    if (props.focused) focusingCell.value = (focusingCell.value - 1 + props.colors.length) % props.colors.length
  },
  "moveRight": () => {
    if (props.focused) focusingCell.value = (focusingCell.value + 1) % props.colors.length
  },
  "moveUp": () => {
    if (props.focused) focusingCell.value = (focusingCell.value - getCellsPerRow() + props.colors.length) % props.colors.length + 1
  },
  "moveDown": () => {
    if (props.focused) focusingCell.value = (focusingCell.value + getCellsPerRow()) % props.colors.length - 1
  },
  "selectColor": () => {
    if (props.focused) props.handleChoosePaletteCell(focusingCell.value) 
  },
  "changeColor": () => {
    if (props.focused && focusingCell.value != 0) {
      selectingColor.value = true
    }
  },
  "confirm": () => {
    if (props.focused) confirmColor(props.colors[focusingCell.value])
  },
  "addColorCell": () => {
    if (props.focused) addColorCell()
  },
  "deleteColorCell": () => {
    if (props.focused && focusingCell.value != 0) {
      if (window.confirm("Are you sure to delete this color?")) {
        props.handleUpdatePalette(null, focusingCell.value)
      }
    }
  }
}
useKeyHandler(manipulatorActions, () => props.acceptKeyInput)

const confirmColor = (color: ColorState) => {
  props.handleUpdatePalette(color, focusingCell.value)
  selectingColor.value = false
}

const addColorCell = () => {
  props.handleUpdatePalette({r: 255, g: 0, b: 0, a: 1}, props.colors.length)
}
</script>

<template class="palette">
  <div class="palette-wrapper" ref="containerRef">
    <div class="palette-container container">
      <div
        v-for="(color, index) in props.colors"
        class="color-cell"
        :style="generateCellStyle(color as ColorState, index)"
        @click="props.handleChoosePaletteCell(index)"
      >
        {{index === 0 ? 'X' : ''}}
      </div>
      <div class="add-color-cell color-cell" @click="addColorCell">+</div>
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
  grid-template-columns: repeat(auto-fill, 20px);
  gap: 5px;
}
.color-cell{
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-color-cell{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
}
</style>
