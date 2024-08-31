<script setup lang="ts">
  import SheetComponent from './Sheet.vue'
  import Sheet from '~/core/Sheet'
  import useSheet from '~/composables/SheetEditor/useSheet'
  import { modes } from '~/composables/consts'
  import sheetLogics from '~/logics/SheetLogic'

  import { onMounted, onUnmounted } from 'vue'
  const props = defineProps<{ sheet: Sheet, handleChangeMode: Function }>()

  const { focusedSprite, updateFocusedSprite } = useSheet()
  
  const proceedFocusedSprite = () => {
    updateFocusedSprite((focusedSprite.value + 1) % props.sheet.sprites.length)
  }
  const changeModeToSpriteEditor = () => {
    props.handleChangeMode(modes.SPRITE_EDITOR, focusedSprite.value)
  }
  const addSprite = () => {
    sheetLogics.addSprite(props.sheet)
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
  <div>
    <SheetComponent :sheet="props.sheet" :focusedSprite="focusedSprite"/>
    <button @click="proceedFocusedSprite()">Next</button>
    <button @click="changeModeToSpriteEditor()">Edit</button>
    <button @click="addSprite()">Add</button>
  </div>
</template>

<style scoped lang="scss">
</style>
