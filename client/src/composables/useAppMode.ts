import { ref } from 'vue';

const modes = {
  sprite: 'SpriteEditor',
  sheet: 'SheetEditor',
  group: 'GroupEditor',
}

type Mode = typeof modes[keyof typeof modes]

export default function useAppMode() {
  const currentMode = ref<Mode>(modes.sprite)
  const setMode = (mode: Mode) => {
    if (!Object.values(modes).includes(mode)) {
      throw new Error(`Invalid mode "${mode}"`);
    }
    currentMode.value = mode;
  }
  return { modes, currentMode, setMode}
}
