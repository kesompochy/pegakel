import { ref } from "vue";
import Sheet from "~/core/Sheet";

export default function useAppSheet() {
  const currentSheet = ref<Sheet>(new Sheet(""));
  const currentSpriteNumber = ref<number>(0);

  currentSheet.value.init();

  return { currentSheet, currentSpriteNumber };
}
