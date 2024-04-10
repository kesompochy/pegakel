<script setup lang="ts">
  import useAppMode from '~/composables/useAppMode'
  import useAppSheet from '~/composables/useAppSheet'
  const { currentMode, currentComponent, setMode, modes } = useAppMode()
  const { currentSheet, currentSpriteNumber } = useAppSheet()
  setMode(modes.SHEET_EDITOR)
</script>

<template>
  <div>
    <h1>MODE: {{ currentMode }}</h1>
    <component :is="currentComponent" :sprite="currentSheet.sprites[currentSpriteNumber]"/>
  </div>
</template>

<style scoped lang="scss">
</style>
