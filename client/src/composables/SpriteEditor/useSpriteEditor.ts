import { ref } from "vue";
import type { Tool } from "~/components/SpriteEditor/SpriteEditor.vue";

const useSpriteEditor = () => {
  const activeColor = ref<number>(0);
  const updateActiveColor = (color: number) => {
    activeColor.value = color;
  };
  const activeTool = ref<Tool>("draw");
  const updateActiveTool = (tool: Tool) => {
    activeTool.value = tool;
  };

  return { activeColor, updateActiveColor, activeTool, updateActiveTool };
};

export default useSpriteEditor;
