import Sprite from '~/core/Sprite';
import ColorState from '~/core/ColorState';
import SpriteLogic from '~/logics/SpriteLogic';
import { ref } from 'vue';

interface SpriteCanvasProps {
  width?: number;
  height?: number;
}

export default function useSpriteCanvas(props: SpriteCanvasProps) {
  const sprite = ref<Sprite>(new Sprite(props?.width || 16, props.height || 16));
  const updateSprite = (x: number, y: number, color: ColorState) => {
    SpriteLogic.updateSprite(sprite.value, {x: x, y: y, color: color});
  }

  return {
    sprite,
    updateSprite
  }
}
