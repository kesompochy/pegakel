<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
import ColorState from '~/core/ColorState'
import ColorStateLogics from '~/logics/ColorState'

const props = defineProps<{
  currentColor: ColorState;
  handleConfirmColor: (color: ColorState) => void;
}>();

const selectingColor = ref<ColorState>(new ColorState(props.currentColor.r, props.currentColor.g, props.currentColor.b, props.currentColor.a))
const confirmColor = () => {
  props.handleConfirmColor(selectingColor.value as ColorState)
}
const updateSelectingColor = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const hex = target.value;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  selectingColor.value = new ColorState(r, g, b, selectingColor.value.a);
}

const currentColorHex = computed(()=>ColorStateLogics.getHex(props.currentColor));
</script>

<template>
  <div>
    <input type="color" :value="ColorStateLogics.getHex(selectingColor)" @input="updateSelectingColor" />
    <div class="current-color"></div>
    <button @click="confirmColor">Confirm</button>
  </div>
</template>

<style scoped lang="scss">
.current-color{
  width: 100px;
  height: 100px;
  background-color: v-bind(currentColorHex);
}
</style>
