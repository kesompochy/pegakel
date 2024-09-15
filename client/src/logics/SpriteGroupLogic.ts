import SpriteGroup from "~/core/SpriteGroup";
import ColorState from "~/core/ColorState";

export default {
  createSpriteGroup(name: string) {
    return new SpriteGroup(name);
  },
  addSprite(spriteGroup: SpriteGroup, spriteId: number) {
    spriteGroup.sprites.push(spriteId);
  },
  updatePalette(spriteGroup: SpriteGroup, cellId: number, color: ColorState) {
    spriteGroup.palette[cellId] = color;
  },
  initPaletteForTest(spriteGroup: SpriteGroup) {
    for (let i = 0; i < 16; i++) {
      this.updatePalette(
        spriteGroup,
        i,
        new ColorState(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 1),
      );
    }
  },
  changeClipSize(spriteGroup: SpriteGroup, size: { width: number, height: number }) {
    spriteGroup.clipSize = size;
  },
  deleteSprite(spriteGroup: SpriteGroup, index: number) {
    spriteGroup.sprites.splice(index, 1);
  },
};
