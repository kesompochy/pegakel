<script setup lang="ts">
  import useAppMode from '~/composables/useAppMode'
  import useAppSheet from '~/composables/useAppSheet'
  const { currentMode, currentComponent, setMode } = useAppMode()
  const { currentSheet, currentSpriteNumber } = useAppSheet()
</script>

<template>
  <div>
    <h1>MODE: {{ currentMode }}</h1>
    <component :is="currentComponent" :sprite="currentSheet.sprites[currentSpriteNumber]"/>
  </div>
</template>

<style scoped lang="scss">
</style>
