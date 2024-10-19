<script setup lang="ts">
  import type Tool from '~/core/Tool';
  const props = defineProps<{
    activeTool: Tool; 
    handleChangeTool: (tool: Tool) => void;
    handleGoToSheetEditor: () => void;
  }>();
</script>

<template>
  <div class="toolbox container">
    <button 
      @click="props.handleChangeTool('draw')"
      :style="{ backgroundColor: props.activeTool === 'draw' ? 'lightblue' : 'white' }"
    >Draw</button>
    <button 
       @click="props.handleChangeTool('erase')"
       :style="{ backgroundColor: props.activeTool === 'erase' ? 'lightblue' : 'white' }"
      >Erase</button>
    <button 
      @click="props.handleGoToSheetEditor"
    >Go to Sheet Editor</button>
  </div>
</template>

<style scoped lang="scss">
.toolbox {
  display: flex;
  flex-direction: column;
  height: fit-content;
}
button {
  margin: 10px;
}
</style>
