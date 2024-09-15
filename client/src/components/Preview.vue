<script setup lang="ts">
import Sprite from "~/core/Sprite";
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import SpriteCanvas from '~/components/SpriteCanvas.vue'

const drawingSpriteNumber = ref<number>(0);
const fps = ref<number>(5);
const animationRequest = ref<number | null>(null);

const props = defineProps<{
  sprites: Sprite[]
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
});
onUnmounted(() => {
  if (animationRequest.value) cancelAnimationFrame(animationRequest.value);
});

watch(() => props.sprites, () => {
  nextTick(() => {
    setupCanvases();
  });
}, { deep: true });

const generateCanvasBorderStyle = (index: number) => {
  return (index === (drawingSpriteNumber.value | 0)) ? '2px solid red' : '2px solid black'
}

</script>

<template>
  <div>
    <div class="container">
      <SpriteCanvas :sprite="props.sprites[drawingSpriteNumber | 0]" :width="200" />
      <SpriteCanvas v-for="(sprite, index) in props.sprites" :key="index" :sprite="sprite" :width="100" :border="generateCanvasBorderStyle(index)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px; 

  canvas {
    max-width: 100%;
    height: auto;
  }
}
</style>
