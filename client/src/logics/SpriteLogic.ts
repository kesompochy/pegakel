import Sprite from '~/core/Sprite';
import ColorState from '~/core/ColorState';

export default {
  createSprite(width: number, height: number) {
    return new Sprite(width, height);
  },
  updateSprite(sprite: Sprite, pixelData: {
    x: number, y: number, color: ColorState
  }) {
    if (!sprite.pixels[pixelData.y] || !sprite.pixels[pixelData.y][pixelData.x]) return;
    sprite.pixels[pixelData.y][pixelData.x] = pixelData.color;
  },
}
