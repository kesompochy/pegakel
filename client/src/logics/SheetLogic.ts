import Sheet from "~/core/Sheet";
import Sprite from "~/core/Sprite";
import ColorState from "~/core/ColorState";
import spriteLogic from "~/logics/SpriteLogic";
export default {
  createSheet(name: string) {
    return new Sheet(name);
  },
  init(sheet: Sheet): Sheet {
    const initSprite = new Sprite(16, 16);
    sheet.sprites.push(initSprite);
    return sheet;
  },
  generateSheetForTest() {
    const sheet = this.createSheet("sheet");
    this.init(sheet);
    const sprite = sheet.sprites[0];
    spriteLogic.updateSprite(sprite, { x: 0, y: 0, color: new ColorState(255, 0, 0, 255) });
    return sheet;
  },
};
