<script setup lang="ts">
  import SheetComponent from './Sheet.vue'
  import Sheet from '~/core/Sheet'
  import { modes } from '~/composables/consts'
  import sheetLogics from '~/logics/SheetLogic'
  import SpriteGroupLogics from '~/logics/SpriteGroupLogic'
  import { useKeyHandler } from '~/composables/useKeyHandler'

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


  type ManipulationAction = "goToSpriteEditor" | "proceedFocusedSprite" | "deleteFocusedSprite" | "addSprite" | "proceedFocusedGroup" | "addSpriteGroup" | "moveLeft" | "moveDown" | "moveUp" | "moveRight" | "pickSpriteToGroup"
  const keyActionMap: Record<string, ManipulationAction> = {
    "i": "goToSpriteEditor",
    "n": "proceedFocusedSprite",
    "d": "deleteFocusedSprite",
    "a": "addSprite",
    "N": "proceedFocusedGroup",
    "A": "addSpriteGroup",
    "h": "moveLeft",
    "j": "moveDown",
    "k": "moveUp",
    "l": "moveRight",
    "p": "pickSpriteToGroup",
  }
  const manipulationActions: Record<ManipulationAction, () => void> = {
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
      SpriteGroupLogics.addSprite(props.sheet.groups[props.currentSpriteGroupId], focusedSpriteIdInSheet.value)
    },
  }
  useKeyHandler(keyActionMap, manipulationActions)
</script>

<template>
  <div class="container">
    <SheetComponent 
      :sheet="props.sheet" 
      :currentSpriteGroupId="props.currentSpriteGroupId"
      :focusedSpriteInGroup="focusedSpriteInGroup"
      :focusedSpriteIdInSheet="focusedSpriteIdInSheet"
    />
    <button @click="proceedFocusedSprite()">Next</button>
    <button @click="changeModeToSpriteEditor()">Edit</button>
    <button @click="addSprite()">Add</button>
    <button @click="deleteSpriteFromGroup(props.currentSpriteGroupId, focusedSpriteInGroup)">Delete</button>
  </div>
</template>

<style scoped lang="scss">
</style>
