import { onMounted, onUnmounted, reactive } from 'vue';
import KeyMapConfig from '~/configs/actionKeyMap.json';

interface KeyFunctionMap {
  [key: string]: () => void;
}

export const registeredActions = reactive<Set<keyof typeof KeyMapConfig>>(new Set());

export const useKeyHandler = (actionFunctionMap: Partial<Record<keyof typeof KeyMapConfig, ()=>void>>) => {
  const keyFunctionMap: KeyFunctionMap  = Object.fromEntries(
    Object.entries(actionFunctionMap).map(([action, func]) => [
      KeyMapConfig[action as keyof typeof KeyMapConfig].key,
      func
    ])
  );
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key in keyFunctionMap) {
      keyFunctionMap[event.key]();
    }
  };
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    Object.keys(actionFunctionMap).forEach((action) => {
      registeredActions.add(action as keyof typeof KeyMapConfig);
    });
  });
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    Object.keys(actionFunctionMap).forEach((action) => {
      registeredActions.delete(action as keyof typeof KeyMapConfig);
    });
  });
}
