import SpriteGroup from "~/core/SpriteGroup";
import ColorState from "~/core/ColorState";

export default {
  createSpriteGroup(name: string) {
    return new SpriteGroup(name);
  },
  updatePalette(spriteGroup: SpriteGroup, cellId: number, color: ColorState) {
    spriteGroup.palette[cellId] = color;
  },
  initPaletteForTest(spriteGroup: SpriteGroup) {
    for (let i = 0; i < 16; i++) {
      spriteGroup.palette[i] = new ColorState(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        1
      );
    }
  },
};
