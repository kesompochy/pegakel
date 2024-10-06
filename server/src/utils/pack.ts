interface Sprite {
  index: number;
  width: number;
  height: number;
}

interface PackedSprite extends Sprite {
  x: number;
  y: number;
}

interface PackingResult {
  packedSprites: PackedSprite[];
  sheetWidth: number;
  sheetHeight: number;
}

const packSprites = (sprites: Sprite[]): PackingResult => {
  const sortedSprites = [...sprites].sort((a, b) => b.height - a.height);

  const packedSprites: PackedSprite[] = [];
  const levels: { y: number; height: number; availableWidth: number }[] = [];

  let sheetWidth = 0;
  let sheetHeight = 0;

  for (const sprite of sortedSprites) {
    let packed = false;

    for (const level of levels) {
      if (sprite.width <= level.availableWidth) {
        packedSprites.push({
          ...sprite,
          x: sheetWidth - level.availableWidth,
          y: level.y,
        });
        level.availableWidth -= sprite.width;
        packed = true;
        break;
      }
    }

    if (!packed) {
      const newLevelY = sheetHeight;
      levels.push({ y: newLevelY, height: sprite.height, availableWidth: sheetWidth });
      packedSprites.push({
        ...sprite,
        x: 0,
        y: newLevelY,
      });
      sheetHeight += sprite.height;
      sheetWidth = Math.max(sheetWidth, sprite.width);
      levels[levels.length - 1].availableWidth = sheetWidth - sprite.width;
    }
  }

  return { packedSprites, sheetWidth, sheetHeight };
};

export { packSprites };
