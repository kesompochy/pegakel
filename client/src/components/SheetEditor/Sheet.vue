<script setup lang="ts">
import Sheet from '~/core/Sheet'

import SpriteCanvas from '~/components/SpriteCanvas.vue'
import { ref, defineProps, computed } from 'vue'

const props = defineProps<{ 
  sheet: Sheet, 
  currentSpriteGroupId?: number,
  focusedSpriteInGroup: number, 
  focusedSpriteIdInSheet: number,
}>()
const pixelWidth = ref<number>(2)

const generateSpriteStyleBorder = (groupIndex: number, spriteIndexInGroup: number, spriteIndexInSheet: number) => {
  let border = 'none'

  if (props.currentSpriteGroupId === undefined || props.currentSpriteGroupId === null) {
    return border
  }
  if (props.currentSpriteGroupId === groupIndex && props.focusedSpriteInGroup === spriteIndexInGroup) {
    border = '2px solid black'
  } else if (spriteIndexInSheet === props.sheet.groups[props.currentSpriteGroupId].sprites[props.focusedSpriteInGroup]) {
    border = '1px solid black'
  }

  return border
}
const generateSpriteStyleBorderInSheet = (spriteIndexInSheet: number) => {
  let border = 'none'

  if (props.focusedSpriteIdInSheet === spriteIndexInSheet) {
    border = '2px solid red'
  }

  return border
}
const generateSpriteStyleOverlay = (spriteIndexInSheet: number) => {
  let overlay = 'transparent'

  if (props.focusedSpriteIdInSheet === spriteIndexInSheet) {
    overlay = 'rgba(200, 0, 0, 0.5)'
  }

  return overlay
}

</script>

<template>
  <div class="sheet-container">
    <div class="sheet">
      <div class="sprites">
        <SpriteCanvas 
          v-for="(sprite, index) in props.sheet.sprites" 
          :sprite="sprite" 
          :width="pixelWidth * sprite.width" 
          :border="generateSpriteStyleBorderInSheet(index)"
        />
      </div>
      <div class="group" 
        :key="groupIndex" 
        v-for="(group, groupIndex) in props.sheet.groups"
        :style="{
          border: props.currentSpriteGroupId === groupIndex ? '2px solid blue' : '1px solid blue'
        }"
      >
        <SpriteCanvas 
          v-for="(spriteIndex, index) in group.sprites" 
          :sprite="props.sheet.sprites[spriteIndex]" 
          :width="pixelWidth * props.sheet.sprites[spriteIndex]?.width" 
          :border="generateSpriteStyleBorder(groupIndex, index, spriteIndex)"
          :overlay="generateSpriteStyleOverlay(spriteIndex)"
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
.sheet-container {
  width: 100%;
  border: 1px solid black;
  padding: 10px;
  .sprites {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
