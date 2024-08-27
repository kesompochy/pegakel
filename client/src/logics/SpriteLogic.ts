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
  changeClip(sprite: Sprite, clip: { x: number, y: number }) {
    sprite.clipX = clip.x;
    sprite.clipY = clip.y;
  },
  updateSpriteSize(sprite: Sprite, left: number, top: number, bottom: number, right: number) {
    const newWidth = sprite.width + left + right;
    const newHeight = sprite.height + top + bottom;
    if ( left > 0) {
      sprite.pixels = sprite.pixels.map(row => [...Array(left).fill(new ColorState(0, 0, 0, 0)), ...row]);
    } else if (left < 0) {
      sprite.pixels = sprite.pixels.map(row => row.slice(-left));
    }
    if (right > 0) {
      sprite.pixels = sprite.pixels.map(row => [...row, ...Array(right).fill(new ColorState(0, 0, 0, 0))]);
    } else if (right < 0) {
      sprite.pixels = sprite.pixels.map(row => row.slice(0, right));
    }
    if (top > 0) {
      const newRows = Array(top).fill(new ColorState(0, 0, 0, 0)).map(() => Array(newWidth).fill(new ColorState(0, 0, 0, 0)));
      sprite.pixels = [...newRows, ...sprite.pixels];
    } else if (top < 0) {
      sprite.pixels = sprite.pixels.slice(-top);
    }
    if (bottom > 0) {
      const newRows = Array(bottom).fill(new ColorState(0, 0, 0, 0)).map(() => Array(newWidth).fill(new ColorState(0, 0, 0, 0)));
      sprite.pixels = [...sprite.pixels, ...newRows];
    } else if (bottom < 0) {
      sprite.pixels = sprite.pixels.slice(0, bottom);
    }
    sprite.width = newWidth;
    sprite.height = newHeight;
    this.changeClip(sprite, { x: sprite.clipX + left, y: sprite.clipY + top });
  }
}
