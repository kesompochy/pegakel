<script setup lang="ts">
  import SheetComponent from './Sheet.vue'
  import Sheet from '~/core/Sheet'
  import { modes } from '~/composables/consts'
  import sheetLogics from '~/logics/SheetLogic'
  import SpriteGroupLogics from '~/logics/SpriteGroupLogic'
  import { useKeyHandler } from '~/composables/useKeyHandler'
  import KeyMapConfig from '~/configs/actionKeyMap.json'

  import { ref } from 'vue'
  const props = defineProps<{ 
    sheet: Sheet, 
    handleChangeMode: Function, 
    currentSpriteGroupId: number,
    updateCurrentSpriteGroupId: (groupId: number) => void,
  }>()

  const focusedSpriteInGroup = ref<number>(0)
  const focusedSpriteIdInSheet = ref<number>(0)
  
  const proceedFocusedSprite = () => {
    focusedSpriteInGroup.value = (focusedSpriteInGroup.value + 1) % props.sheet.groups[props.currentSpriteGroupId].sprites.length
  }
  const changeModeToSpriteEditor = () => {
    const spriteIndex = focusedSpriteIdInSheet.value
    props.handleChangeMode(modes.SPRITE_EDITOR, spriteIndex)
  }
  const addSprite = () => {
    sheetLogics.addSprite(props.sheet)
  }
  const deleteSpriteFromGroup = (groupIndex: number, spriteIndex: number) => {
    SpriteGroupLogics.deleteSprite(props.sheet.groups[groupIndex], spriteIndex)
  }
  const deleteSprite = () => {
    sheetLogics.deleteSprite(props.sheet, focusedSpriteIdInSheet.value)
  }
  const pickSpriteToGroup = () => {
    SpriteGroupLogics.addSprite(props.sheet.groups[props.currentSpriteGroupId], focusedSpriteIdInSheet.value)
  }
  const swapSprites = () => {
    const group = props.sheet.groups[props.currentSpriteGroupId]
    if (group.sprites.length < 2) {
      return
    }
    const spriteIndex = focusedSpriteInGroup.value
    const nextSpriteIndex = spriteIndex + 1
    if (nextSpriteIndex >= group.sprites.length) {
      return
    }
    SpriteGroupLogics.swapSprites(group, spriteIndex, nextSpriteIndex)
  }

  const manipulationActions: Partial<Record<keyof typeof KeyMapConfig, () => void>> = {
    "goToSpriteEditor": () => {
      changeModeToSpriteEditor()
    },
    "proceedFocusedSprite": () => {
      proceedFocusedSprite()
    },
    "deleteFocusedSprite": () => {
      deleteSpriteFromGroup(props.currentSpriteGroupId, focusedSpriteInGroup.value)
    },
    "addSprite": () => {
      addSprite()
    },
    "proceedFocusedGroup": () => {
      props.updateCurrentSpriteGroupId((props.currentSpriteGroupId + 1) % props.sheet.groups.length) 
    },
    "addSpriteGroup": () => {
      sheetLogics.addSpriteGroup(props.sheet)
      SpriteGroupLogics.addSprite(props.sheet.groups[props.sheet.groups.length - 1], focusedSpriteIdInSheet.value)
    },
    "moveLeft": () => {
      focusedSpriteIdInSheet.value = Math.max(0, focusedSpriteIdInSheet.value - 1)
    },
    "moveDown": () => {
    },
    "moveUp": () => {
    },
    "moveRight": () => {
      focusedSpriteIdInSheet.value = Math.min(props.sheet.sprites.length - 1, focusedSpriteIdInSheet.value + 1)
    },
    "pickSpriteToGroup": () => {
      pickSpriteToGroup()
    },
    "deleteSprite": () => {
      deleteSprite()
    },
    "swapSprites": () => {
      swapSprites()
    },
    "cloneSprite": () => {
      sheetLogics.cloneSprite(props.sheet, focusedSpriteIdInSheet.value)
    },
  }
  useKeyHandler(manipulationActions)
</script>

<template>
  <div class="container">
    <SheetComponent 
      :sheet="props.sheet" 
      :currentSpriteGroupId="props.currentSpriteGroupId"
      :focusedSpriteInGroup="focusedSpriteInGroup"
      :focusedSpriteIdInSheet="focusedSpriteIdInSheet"
      :updateCurrentSpriteGroupId="props.updateCurrentSpriteGroupId"
      :updateFocusedSpriteIdInSheet="(index: number) => { focusedSpriteIdInSheet = index }"
      :updateFocusedSpriteInGroup="(index: number) => { focusedSpriteInGroup = index }"
    />
    <button @click="changeModeToSpriteEditor()">Edit</button>
    <button @click="addSprite()">Add</button>
    <button @click="deleteSprite()">Delete</button>
    <button @click="deleteSpriteFromGroup(props.currentSpriteGroupId, focusedSpriteInGroup)">Remove Sprite from Group</button>
    <button @click="pickSpriteToGroup()">Pick Sprite to Group</button>
    <button @click="swapSprites()">Swap Sprites</button>
  </div>
</template>

<style scoped lang="scss">
</style>
