<script setup lang="ts">
  import { ref } from 'vue'

  import useAppMode from '~/composables/useAppMode'
  import SpriteEditorMode from '~/components/SpriteEditor/SpriteEditorMode.vue'
  const { currentMode, setMode } = useAppMode()
  const handleChangeMode = (newMode: string) => {
    setMode(newMode)
  }
</script>

<template>
  <div>
    <h1>MODE: {{ currentMode }}</h1>
    <component :is="currentMode"/>
  </div>
</template>

<style scoped lang="scss">
</style>
