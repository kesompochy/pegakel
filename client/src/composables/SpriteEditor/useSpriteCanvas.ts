import Sprite from "~/core/Sprite";
import ColorState from "~/core/ColorState";
import SpriteLogic from "~/logics/SpriteLogic";
import { ref } from "vue";

interface SpriteCanvasProps {
  width?: number;
  height?: number;
  sprite: Sprite;
}

export default function useSpriteCanvas(props: SpriteCanvasProps) {
  const sprite = ref<Sprite>(props.sprite);
  const updateSprite = (x: number, y: number, color: ColorState) => {
    SpriteLogic.updateSprite(sprite.value, { x: x, y: y, color: color });
  };

  return {
    sprite,
    updateSprite,
  };
}
