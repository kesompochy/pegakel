import { ref, markRaw } from "vue";
import SpriteEditor from "~/components/SpriteEditor/SpriteEditor.vue";
import SheetEditor from "~/components/SheetEditor/SheetEditor.vue";
import { modes } from "~/composables/consts";

const components = {
  SpriteEditor: markRaw(SpriteEditor),
  SheetEditor: markRaw(SheetEditor),
};

type Mode = (typeof modes)[keyof typeof modes];
type Component = (typeof components)[keyof typeof components];

export default function useAppMode() {
  const currentMode = ref<Mode>(modes.SPRITE_EDITOR);
  const currentComponent = ref<Component>(components[currentMode.value]);
  const setMode = (mode: Mode) => {
    if (!Object.values(modes).includes(mode)) {
      throw new Error(`Invalid mode "${mode}"`);
    }
    currentMode.value = mode;
    currentComponent.value = components[mode];
  };
  return { currentMode, setMode, currentComponent };
}

export { modes };
