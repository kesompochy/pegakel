import { onMounted, onUnmounted } from 'vue';
import KeyMapConfig from '~/configs/actionKeyMap.json';

export const useKeyHandler = (actionFunctionMap: Partial<Record<keyof typeof KeyMapConfig, ()=>void>>) => {
  const keyFunctionMap = Object.fromEntries(
    Object.entries(actionFunctionMap).map(([action, func]) => [
      KeyMapConfig[action as keyof typeof KeyMapConfig],
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
  });
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
}


/*
  let keyProcessMap: Record<string, () => void> = {};

  if (actionProcessMap) {
    keyProcessMap = Object.fromEntries(
      Object.entries(keyActionMap).map(([key, actionName]) => [
        key,
        actionProcessMap[actionName]
      ])
    );
  } else {
    Object.entries(keyActionMap).map(([key, value]) => {
      if (typeof value === 'string') {
        throw new Error('actionProcessMap is required when keyActionMap is a Record<string, string>');
      }
    })
    keyProcessMap = keyActionMap as Record<string, () => void>;
  }

  const handleKeyDown = (event: KeyboardEvent) => {
     if (event.key in keyActionMap) {
      keyProcessMap[event.key]()
     }
  }
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}*/
