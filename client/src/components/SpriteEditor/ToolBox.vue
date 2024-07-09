<script setup lang="ts">
  import { defineProps } from 'vue';
  import type Tool from '~/core/Tool';
  const props = defineProps<{
    activeTool: Tool; 
    handleChangeTool: (tool: Tool) => void;
  }>();
</script>

<template>
  <div class="toolbox">
    <span>Toolbox</span>
    <button 
      @click="props.handleChangeTool('draw')"
      :style="{ backgroundColor: props.activeTool === 'draw' ? 'lightblue' : 'white' }"
    >Draw</button>
    <button 
       @click="props.handleChangeTool('erase')"
       :style="{ backgroundColor: props.activeTool === 'erase' ? 'lightblue' : 'white' }"
      >Erase</button>
  </div>
</template>

<style scoped lang="scss">
.toolbox {
  border: 1px solid black;
}
button {
  margin: 5px;
}
</style>
