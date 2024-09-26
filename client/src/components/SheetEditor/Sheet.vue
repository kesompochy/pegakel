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
          :sprite="props.sheet.sprites[spriteIndex]" 
          :width="pixelWidth * props.sheet.sprites[spriteIndex].width" 
          :border="focusedSpriteInGroup === index ? '2px solid red' : (group.sprites[focusedSpriteInGroup] === spriteIndex ? '1px solid red' : 'none')"
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
