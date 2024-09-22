import { onMounted, onUnmounted } from 'vue';

export const useKeyHandler = (keyActionMap: Record<string, ()=>void> | Record<string, string>, actionProcessMap?: Record<string, ()=>void>) => {

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
}
