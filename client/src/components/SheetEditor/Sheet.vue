<script setup lang="ts">
import Sheet from '~/core/Sheet'
import ColorState from '~/core/ColorState'

import SpriteCanvas from '~/components/SpriteCanvas.vue'
import { ref, defineProps } from 'vue'

const props = defineProps<{ 
  sheet: Sheet, 
  currentSpriteGroupId?: number,
  focusedSpriteInGroup: number, 
  focusedSpriteIdInSheet: number,
  updateCurrentSpriteGroupId: (groupId: number) => void,
  updateFocusedSpriteIdInSheet: (spriteId: number) => void,
  updateFocusedSpriteInGroup: (index: number) => void,
  palette: ColorState[],
}>()
const pixelWidth = ref<number>(3)

const generateSpriteStyleOverlay = (spriteIndexInSheet: number) => {
  let overlay = 'transparent'

  if (props.focusedSpriteIdInSheet === spriteIndexInSheet) {
    overlay = 'rgba(200, 0, 0, 0.5)'
  }

  return overlay
}


const handleGroupClick = (groupIndex: number) => {
  props.updateCurrentSpriteGroupId(groupIndex)
}

const handleSpriteClick = (spriteIndex: number) => {
  props.updateFocusedSpriteIdInSheet(spriteIndex)
}

const handleClickSpriteInGroup = (groupIndex: number, spriteIndexInGroup: number) => {
  props.updateCurrentSpriteGroupId(groupIndex)
  props.updateFocusedSpriteInGroup(spriteIndexInGroup)
}

</script>

<template>
  <div class="sheet-container container">
    <div class="sheet">
      <div class="sprites">
        <div class="sprite" 
          :key="index" 
          v-for="(sprite, index) in props.sheet.sprites"
        >
          <SpriteCanvas 
            :sprite="sprite" 
            :width="pixelWidth * sprite.width" 
            :focused="props.focusedSpriteIdInSheet === index"
            @click="() => { handleSpriteClick(index) }"
            :palette="props.palette"
          />
        </div>
      </div>
      <div class="group" 
        :key="groupIndex" 
        v-for="(group, groupIndex) in props.sheet.groups"
        :class="{
          focused: props.currentSpriteGroupId === groupIndex
        }"
        @click="() => { handleGroupClick(groupIndex) }"
      >
        <SpriteCanvas 
          v-for="(spriteIndex, index) in group.sprites" 
          :sprite="props.sheet.sprites[spriteIndex]" 
          :width="0.8 * pixelWidth * props.sheet.sprites[spriteIndex]?.width" 
          :overlay="generateSpriteStyleOverlay(spriteIndex)"
          @click="() => { handleClickSpriteInGroup(groupIndex, index) }"
          :same="props.focusedSpriteIdInSheet === spriteIndex"
          :palette="props.palette"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sheet-container {
  width: 100%;
  .sheet{
    .sprites {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 100px;
      box-sizing: border-box;
      .sprite {
        &.focused {
          border: 2px solid #000;
        }
      }
   }
    .group {
      margin: 5px;
      display: flex;
      width: fit-content;
      border: 1px solid #333;
      box-sizing: border-box;
      &.focused {
        border: 2px solid #333;
      }
    }
  }
}
</style>
