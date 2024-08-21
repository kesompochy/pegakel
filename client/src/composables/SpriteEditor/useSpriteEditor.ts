import { ref } from "vue";
import type Tool from "~/core/Tool";

type ManipulationMode = "touch" | "key";
const ManipulationMode = {
  TOUCH: "touch",
  KEY: "key",
} as const;

const useSpriteEditor = () => {
  const activeColor = ref<number>(0);
  const updateActiveColor = (color: number) => {
    activeColor.value = color;
  };
  const activeTool = ref<Tool>("draw");
  const updateActiveTool = (tool: Tool) => {
    activeTool.value = tool;
  };

  const manipulationMode = ref<ManipulationMode>(ManipulationMode.KEY);
  const updateManipulationMode = (mode: ManipulationMode) => {
    manipulationMode.value = mode;
  };

  const canvasManipulatingCell = ref<{ x: number; y: number }>({ x: 0, y: 0 });
  const updateCanvasManipulatingCell = (cell: {x: number, y: number}) => {
    canvasManipulatingCell.value = cell;
  };

  return { activeColor, updateActiveColor, activeTool, updateActiveTool, manipulationMode, updateManipulationMode, canvasManipulatingCell, updateCanvasManipulatingCell };
};

export default useSpriteEditor;
export type { ManipulationMode };
