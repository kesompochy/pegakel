<script setup lang="ts">
  import useAppMode from '~/composables/useAppMode'
  const { currentMode, currentComponent, setMode } = useAppMode()
</script>

<template>
  <div>
    <h1>MODE: {{ currentMode }}</h1>
    <component :is="currentComponent"/>
  </div>
</template>

<style scoped lang="scss">
</style>
