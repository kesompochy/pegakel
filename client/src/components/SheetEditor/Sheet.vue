<script setup lang="ts">
import Sheet from '~/core/Sheet'

import SpriteCanvas from '~/components/SpriteCanvas.vue'

const props = defineProps<{ sheet: Sheet, focusedSprite: number, currentSpriteGroupId?: number }>()
</script>

<template>
  <div class="sheet-container">
    <span>This is the sheet</span>
    <div class="sheet">
      <div class="group" 
        :key="groupIndex" 
        v-for="(group, groupIndex) in props.sheet.groups"
        :style="{
          border: props.currentSpriteGroupId === groupIndex ? '2px solid blue' : 'none'
        }"
      >
        <SpriteCanvas 
          v-for="(spriteIndex, index) in group.sprites" 
          :key="index" 
          :sprite="props.sheet.sprites[spriteIndex]" 
          :width="30" 
          :border="focusedSprite === spriteIndex ? '2px solid red' : 'none'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.group {
  display: flex;
  width: fit-content;
}
</style>
