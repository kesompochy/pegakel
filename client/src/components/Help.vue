<script setup lang="ts">
  import { defineProps } from 'vue'
  import KeyMapConfig from '~/configs/actionKeyMap.json'
  import { registeredActions } from '~/composables/useKeyHandler';

  const props = defineProps<{ 
    keyActionMap: typeof KeyMapConfig,
  }>()

</script>

<template>
  <div class="help-container container">
    <div class="help">
      <h1>Help</h1>
      <div class="help-content">
        <div class="help-item" v-for="(value, action) in registeredActions" :key="action">
          <span class="key">{{ props.keyActionMap[value].key }}</span><span class="action">{{ props.keyActionMap[value].description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.help-container {
  max-width: 600px;

  .help {
    padding: 20px;

    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #333;
    }

    .help-content {
      display: grid;
      gap: 10px;
    }

    .help-item {
      display: flex;
      align-items: center;
      background-color: white;
      border-radius: 4px;
      padding: 10px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .key {
      background-color: #e0e0e0;
      color: #333;
      font-family: monospace;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      margin-right: 10px;
    }

    .action {
      color: #666;
      flex-grow: 1;
    }
  }
}
</style>
