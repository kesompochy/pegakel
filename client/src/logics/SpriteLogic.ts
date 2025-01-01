import Sprite from '~/core/Sprite';

export default {
  createSprite(width: number, height: number) {
    return new Sprite(width, height);
  },
  updateSprite(sprite: Sprite, pixelData: {
    x: number, y: number, color: number
  }) {
    if ( sprite.pixels[pixelData.y] == undefined || sprite.pixels[pixelData.y][pixelData.x] == undefined) return;
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
      sprite.pixels = sprite.pixels.map(row => [...Array(left).fill(0), ...row]);
    } else if (left < 0) {
      sprite.pixels = sprite.pixels.map(row => row.slice(-left));
    }
    if (right > 0) {
      sprite.pixels = sprite.pixels.map(row => [...row, ...Array(right).fill(0)]);
    } else if (right < 0) {
      sprite.pixels = sprite.pixels.map(row => row.slice(0, right));
    }
    if (top > 0) {
      const newRows = Array(top).fill(0).map(() => Array(newWidth).fill(0));
      sprite.pixels = [...newRows, ...sprite.pixels];
    } else if (top < 0) {
      sprite.pixels = sprite.pixels.slice(-top);
    }
    if (bottom > 0) {
      const newRows = Array(bottom).fill(0).map(() => Array(newWidth).fill(0));
      sprite.pixels = [...sprite.pixels, ...newRows];
    } else if (bottom < 0) {
      sprite.pixels = sprite.pixels.slice(0, bottom);
    }
    sprite.width = newWidth;
    sprite.height = newHeight;
    this.changeClip(sprite, { x: sprite.clipX + left, y: sprite.clipY + top });
  },
  generateClippedSprite(sprite: Sprite, clipWidth: number, clipHeight: number): Sprite {
    const clipX = sprite.clipX;
    const clipY = sprite.clipY;
    const newSprite = this.createSprite(clipWidth, clipHeight);
    for (let y = 0; y < clipHeight; y++) {
      for (let x = 0; x < clipWidth; x++) {
        newSprite.pixels[y][x] = sprite.pixels[y + clipY]?.[x + clipX] || 0;
      }
    }
    return newSprite;
  },
  cloneSprite(sprite: Sprite): Sprite {
    const newSprite = this.createSprite(sprite.width, sprite.height);
    for (let y = 0; y < sprite.height; y++) {
      for (let x = 0; x < sprite.width; x++) {
        newSprite.pixels[y][x] = sprite.pixels[y][x];
      }
    }
    newSprite.clipX = sprite.clipX;
    newSprite.clipY = sprite.clipY;
    return newSprite;
  }
}
