import Sheet from "~/core/Sheet";
import Sprite from "~/core/Sprite";
import ColorState from "~/core/ColorState";
import SpriteLogic from "~/logics/SpriteLogic";
import SpriteGroupLogic from "~/logics/SpriteGroupLogic";

export default {
  createSheet(name: string) {
    return new Sheet(name);
  },
  init(sheet: Sheet): Sheet {
    const initSprite = new Sprite(16, 16);
    sheet.sprites.push(initSprite);
    return sheet;
  },
  addSprite(sheet: Sheet): Sheet {
    const newSprite = new Sprite(16, 16);
    sheet.sprites.push(newSprite);
    return sheet;
  },
  generateSheetForTest() {
    const sheet = this.createSheet("sheet");
    this.init(sheet);
    this.addSprite(sheet);
    SpriteGroupLogic.addSprite(sheet.groups[0], 0);
    for (let sprite of sheet.sprites) {
      for (let y = 0; y < sprite.height; y++) {
        for (let x = 0; x < sprite.width; x++) {
          SpriteLogic.updateSprite(sprite, {
            x,
            y,
            color: 0
          });
        }
      }
    }

    return sheet;
  },
  importSheetFromJson(json: string) {
    return JSON.parse(json);
  },
  getClippedSpritesInGroup(sheet: Sheet, groupId: number) {
    const group = sheet.groups[groupId];

    if (group.sprites.length === 0) {
      return [];
    }
    if (!group.clipSize) {
      const width = group.sprites.reduce((max, spriteId) => {
        const sprite = sheet.sprites[spriteId];
        return Math.max(max, sprite.width);
      }, 0);
      const height = group.sprites.reduce((max, spriteId) => {
        const sprite = sheet.sprites[spriteId];
        return Math.max(max, sprite.height);
      }, 0);


      group.clipSize = { width: width, height: height };
    }
    const clipSize = group.clipSize;
    return group.sprites.map((spriteId) => SpriteLogic.generateClippedSprite(sheet.sprites[spriteId], clipSize.width, clipSize.height));
  },
  deleteSprite(sheet: Sheet, spriteIndex: number) {
    sheet.groups.forEach((group, index) => {
      group.sprites = group.sprites.filter((spriteId) => spriteId !== spriteIndex);
      if (group.sprites.length === 0) {
        sheet.groups.splice(index, 1);
      }
    })
 
    sheet.sprites.splice(spriteIndex, 1);
 },
  addSpriteGroup(sheet: Sheet) {
    const defaultName = `group-${sheet.groups.length}`;
    sheet.groups.push(SpriteGroupLogic.createSpriteGroup(defaultName));
  },
  updatePalette(sheet: Sheet, color: ColorState, cellId: number) {
    if (!sheet.palette) {
      sheet.palette = [];
    }
    sheet.palette[cellId] = color;
  },
  cloneSprite(sheet: Sheet, spriteIndex: number) {
    const sprite = sheet.sprites[spriteIndex];
    const newSprite = SpriteLogic.cloneSprite(sprite);
    sheet.sprites.push(newSprite);
  }
};
