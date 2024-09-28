<script setup lang="ts">
  import { defineProps } from 'vue'

  const props = defineProps<{ 
    keyActionMap: Record<string, string>,
  }>()
</script>

<template>
  <div class="help-container">
    <div class="help">
      <h1>Help</h1>
      <div class="help-content">
        <div class="help-item" v-for="(action, key) in props.keyActionMap" :key="key">
          <p>{{ key }}: {{ action }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
