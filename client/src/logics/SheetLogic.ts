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
            color: new ColorState((Math.random() * 255) | 0, (Math.random() * 255) | 0, (Math.random() * 255) | 0, 1),
          });
        }
      }
    }
    SpriteGroupLogic.initPaletteForTest(sheet.groups[0]);

    return sheet;
  },
  importSheetFromJson(json: string) {
    return JSON.parse(json);
  },
  getClippedSpritesInGroup(sheet: Sheet, groupId: number) {
    const group = sheet.groups[groupId];
    const clipSize = group.clipSize;
    if (!clipSize) return [];
    return group.sprites.map((spriteId) => SpriteLogic.generateClippedSprite(sheet.sprites[spriteId], clipSize.width, clipSize.height));
    //return sheet.groups[groupId].sprites.map((spriteId) => sheet.sprites[spriteId]);
  }
};
