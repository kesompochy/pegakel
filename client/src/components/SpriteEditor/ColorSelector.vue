<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import ColorState from '~/core/ColorState'

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
  inputA.value = colorRefA.value?.value ? parseInt(colorRefA.value.value) : 0
}

watch(() => props.focused, (focused) => {
  if (focused) {
   nextTick(() => {
      inputR.value = props.currentColor?.r || 0
      inputG.value = props.currentColor?.g || 0
      inputB.value = props.currentColor?.b || 0
      inputA.value = props.currentColor?.a || 0
   
      colorRefR.value?.focus()
    })
  }
})

const keyActionMap: Record<string, string> = {
  "Enter": "confirmColor",
}
const manipulatorActions: Record<string, ()=>void> = {
  "confirmColor": () => {
    if (props.focused) {
      confirmColor()
    }
  },
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.focused && event.key in keyActionMap) {
    event.preventDefault()
    manipulatorActions[keyActionMap[event.key]]()
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})


</script>

<template>
  <div class="container">
    <input type="number" ref="colorRefR" @input="updateSelectingColor" :value="inputR">
    <input type="number" ref="colorRefG" @input="updateSelectingColor" :value="inputG">
    <input type="number" ref="colorRefB" @input="updateSelectingColor" :value="inputB">
    <input type="number" ref="colorRefA" @input="updateSelectingColor" :value="inputA">
    <div class="preview" :style="{ backgroundColor: `rgba(${inputR}, ${inputG}, ${inputB}, ${inputA})`}"/>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  gap: 8px;
  align-items: center;
}
.preview {
  width: 10px;
  height: 10px;
  border: 1px solid black;
}
</style>
