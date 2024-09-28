<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import ColorState from '~/core/ColorState'
import { useKeyHandler } from '~/composables/useKeyHandler';
import KeyMapConfig from '~/configs/actionKeyMap.json';

const props = defineProps<{
  currentColor: ColorState | undefined;
  handleConfirmColor: (color: ColorState) => void;
  focused: boolean;
}>();

const confirmColor = () => {
  const selectingColor: ColorState = new ColorState(inputR.value, inputG.value, inputB.value, inputA.value)
  props.handleConfirmColor(selectingColor)
}
const colorRefR = ref<HTMLInputElement | null>(null)
const colorRefG = ref<HTMLInputElement | null>(null)
const colorRefB = ref<HTMLInputElement | null>(null)
const colorRefA = ref<HTMLInputElement | null>(null)
const inputR = ref<number>(0)
const inputG = ref<number>(0)
const inputB = ref<number>(0)
const inputA = ref<number>(0)

const updateSelectingColor = (event: Event) => {
  inputR.value = colorRefR.value?.value ? parseInt(colorRefR.value.value) : 0
  inputG.value = colorRefG.value?.value ? parseInt(colorRefG.value.value) : 0
  inputB.value = colorRefB.value?.value ? parseInt(colorRefB.value.value) : 0
  inputA.value = colorRefA.value?.value ? parseInt(colorRefA.value.value) : 1
}

watch(() => props.focused, (focused) => {
  if (focused) {
   nextTick(() => {
      inputR.value = props.currentColor?.r || 0
      inputG.value = props.currentColor?.g || 0
      inputB.value = props.currentColor?.b || 0
      inputA.value = props.currentColor?.a || 1
   
      colorRefR.value?.focus()
    })
  }
})

const manipulatorActions: Partial<Record<keyof typeof KeyMapConfig, ()=>void>> = {
  "confirmColor": () => {
    if (props.focused) {
      confirmColor()
    }
  },
}
useKeyHandler(manipulatorActions)

</script>

<template>
  <div class="color-selector-container">
    <input step="1"    type="number" ref="colorRefR" @input="updateSelectingColor" :value="inputR">
    <input step="1"    type="number" ref="colorRefG" @input="updateSelectingColor" :value="inputG">
    <input step="1"    type="number" ref="colorRefB" @input="updateSelectingColor" :value="inputB">
    <input step="0.01" type="number" ref="colorRefA" @input="updateSelectingColor" :value="inputA" default="1">
    <div class="preview" :style="{ backgroundColor: `rgba(${inputR}, ${inputG}, ${inputB}, ${inputA})`}"/>
  </div>
</template>

<style scoped lang="scss">
.color-selector-container {
  display: flex;
  gap: 8px;
  align-items: center;
  .preview {
    width: 10px;
    height: 10px;
    border: 1px solid black;
  }
}

</style>
