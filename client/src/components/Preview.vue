<script setup lang="ts">
import Sprite from "~/core/Sprite";
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import SpriteCanvas from '~/components/SpriteCanvas.vue'
import ColorState from '~/core/ColorState'
import { useKeyHandler } from '~/composables/useKeyHandler';
import KeyMapConfig from '~/configs/actionKeyMap.json';

const drawingSpriteNumber = ref<number>(0);
const fps = ref<number>(5);
const animationRequest = ref<number | null>(null);
const groupName = ref<string>('');

const props = defineProps<{
  sprites: Sprite[],
  name: string,
  updateGroupName: (name: string) => void
  palette: ColorState[],
  acceptKeyInput: boolean
}>();

const animationCallback = () => {
  if (props.sprites.length === 0) {
  } else {
   drawingSpriteNumber.value = (drawingSpriteNumber.value + fps.value/60) % props.sprites.length
  }
  if (animationRequest.value) cancelAnimationFrame(animationRequest.value);
  animationRequest.value = requestAnimationFrame(()=>{animationCallback()});
}

const setupCanvases = () => {
  if (animationRequest.value) cancelAnimationFrame(animationRequest.value);
  animationRequest.value = requestAnimationFrame(()=>{animationCallback()});
}

onMounted(() => {
  setupCanvases();
  groupName.value = props.name;
});
onUnmounted(() => {
  if (animationRequest.value) cancelAnimationFrame(animationRequest.value);
});

const toggleAnimation = () => {
  if (animationRequest.value) {
    cancelAnimationFrame(animationRequest.value);
    animationRequest.value = null;
  } else {
    animationRequest.value = requestAnimationFrame(()=>{animationCallback()});
  }
}

watch(() => props.sprites, () => {
  nextTick(() => {
    setupCanvases();
  });
}, { deep: true });
watch(() => props.name, () => {
  groupName.value = props.name;
});
watch(() => props.palette, () => {
  setupCanvases();
});


const manipulatorActions: Partial<Record<keyof typeof KeyMapConfig, ()=>void>> = {
  "toggleAnimation": () => {
    toggleAnimation()
  }
}
useKeyHandler(manipulatorActions, () => props.acceptKeyInput)

</script>

<template>
  <div>
    <div class="preview-container container">
      <input class="grpup-name" type="text" v-model="groupName" @input="()=>{props.updateGroupName(groupName)}"/>
      <SpriteCanvas :sprite="props.sprites[drawingSpriteNumber | 0]" :width="200" :palette="props.palette" />
      <SpriteCanvas v-for="(sprite, index) in props.sprites" :key="index" :sprite="sprite" :width="100" :focused="(index === (drawingSpriteNumber | 0))" :palette="props.palette"/>

      <div class="tools-container">
        <span><input type="number" v-model="fps" class="fps-input" />fps</span>
        <button @click="toggleAnimation">{{ animationRequest ? "■" : "▶" }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; 
}
.fps-input {
  width: 50px;
}
</style>
