import { ref } from "vue";
import Sheet from "~/core/Sheet";
import SheetLogic from "~/logics/SheetLogic";

export default function useAppSheet() {
  const currentSheet = ref<Sheet>(new Sheet(""));
  const updateSheet = (sheet: Sheet) => {
    currentSheet.value = sheet;
  };
  const currentSpriteId = ref<number>(0);
  const currentSpriteGroupId = ref<number>(0);

  currentSheet.value = SheetLogic.createSheet("sheet");

  const initSheetForTest = () => {
    currentSheet.value = SheetLogic.generateSheetForTest();
  };

  const fileName = ref<string>("");
  const setFileName = (name: string) => {
    fileName.value = name;
  };

  return { currentSheet, updateSheet, currentSpriteId, initSheetForTest, currentSpriteGroupId, fileName, setFileName };
}
