<script setup lang="ts">
import Sheet from '~/core/Sheet'

import SpriteCanvas from '~/components/SpriteCanvas.vue'
import { ref, defineProps, computed } from 'vue'

const props = defineProps<{ 
  sheet: Sheet, 
  currentSpriteGroupId?: number,
  focusedSpriteInGroup: number, 
}>()
const pixelWidth = ref<number>(2)

const spritesBelongToNoGroup = computed(() => {
  const noGroupSprites = props.sheet.sprites.filter((sprite, index) => {
    return !props.sheet.groups.some(group => group.sprites.includes(index))
  }) 
  return noGroupSprites.map(sprite => props.sheet.sprites.indexOf(sprite))
})
const generateSpriteStyleBorder = (groupIndex: number, spriteIndexInGroup: number, spriteIndexInSheet: number) => {
  let border = 'none'

  if (props.currentSpriteGroupId === undefined || props.currentSpriteGroupId === null) {
    return border
  }
  if (props.currentSpriteGroupId === groupIndex && props.focusedSpriteInGroup === spriteIndexInGroup) {
    border = '2px solid red'
  } else if (spriteIndexInSheet === props.sheet.groups[props.currentSpriteGroupId].sprites[props.focusedSpriteInGroup]) {
    border = '1px solid red'
  }

  return border
}
</script>

<template>
  <div class="sheet-container">
    <div class="sheet">
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
          :width="pixelWidth * props.sheet.sprites[spriteIndex].width" 
          :border="generateSpriteStyleBorder(groupIndex, index, spriteIndex)"
        />
      </div>
      <div class="group no-group">
        <SpriteCanvas 
          v-for="(spriteIndex, index) in spritesBelongToNoGroup"
          :sprite="props.sheet.sprites[spriteIndex]" 
          :width="pixelWidth * props.sheet.sprites[spriteIndex].width" />
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
}
</style>
