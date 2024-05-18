import { ref } from "vue";

export default function useSheetEditor() {
  const focusedSprite = ref<number>(0);
  const updateFocusedSprite = (index: number) => {
    focusedSprite.value = index;
  };

  return {
    focusedSprite,
    updateFocusedSprite,
  };
}
