<script setup lang="ts">
  import SheetComponent from './Sheet.vue'
  import Sheet from '~/core/Sheet'
  import { modes } from '~/composables/consts'
  import sheetLogics from '~/logics/SheetLogic'
  import SpriteGroupLogics from '~/logics/SpriteGroupLogic'

  import { onMounted, onUnmounted, ref } from 'vue'
  const props = defineProps<{ sheet: Sheet, handleChangeMode: Function, currentSpriteGroupId?: number}>()

  const focusedSpriteInGroup = ref<number>(0)
  
  const proceedFocusedSprite = () => {
    focusedSpriteInGroup.value = (focusedSpriteInGroup.value + 1) % props.sheet.groups[props.currentSpriteGroupId || 0].sprites.length
  }
  const changeModeToSpriteEditor = () => {
    const sheet = props.sheet
    const group = sheet.groups[props.currentSpriteGroupId || 0]
    const spriteIndex = group.sprites[focusedSpriteInGroup.value]
    props.handleChangeMode(modes.SPRITE_EDITOR, spriteIndex)
  }
  const addSprite = () => {
    if (!props.currentSpriteGroupId) {
      return
    }
    sheetLogics.addSprite(props.sheet)
    SpriteGroupLogics.addSprite(props.sheet.groups[props.currentSpriteGroupId], props.sheet.sprites.length - 1)
  }


  type ManipulationAction = "goToSpriteEditor" | "proceedFocusedSprite"
  const keyActionMap: Record<string, ManipulationAction> = {
    "i": "goToSpriteEditor",
    "n": "proceedFocusedSprite"
  }
  const manipulationActions: Record<ManipulationAction, () => void> = {
    "goToSpriteEditor": () => {
      changeModeToSpriteEditor()
    },
    "proceedFocusedSprite": () => {
      proceedFocusedSprite()
    }
  }
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key in keyActionMap) {
      manipulationActions[keyActionMap[e.key]]()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', (e) => {
      handleKeyDown(e)
    });
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', (e) => {
      handleKeyDown(e)
    });
  })
</script>

<template>
  <div class="container">
    <SheetComponent 
      :sheet="props.sheet" 
      :currentSpriteGroupId="props.currentSpriteGroupId"
      :focusedSpriteInGroup="focusedSpriteInGroup"
    />
    <button @click="proceedFocusedSprite()">Next</button>
    <button @click="changeModeToSpriteEditor()">Edit</button>
    <button @click="addSprite()">Add</button>
  </div>
</template>

<style scoped lang="scss">
</style>
