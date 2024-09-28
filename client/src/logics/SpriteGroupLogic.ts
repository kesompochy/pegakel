import SpriteGroup from "~/core/SpriteGroup";

export default {
  createSpriteGroup(name: string) {
    return new SpriteGroup(name);
  },
  addSprite(spriteGroup: SpriteGroup, spriteId: number) {
    spriteGroup.sprites.push(spriteId);
  },
  changeClipSize(spriteGroup: SpriteGroup, size: { width: number, height: number }) {
    spriteGroup.clipSize = size;
  },
  deleteSprite(spriteGroup: SpriteGroup, index: number) {
    spriteGroup.sprites.splice(index, 1);
  },
  updateName(spriteGroup: SpriteGroup, name: string) {
    spriteGroup.name = name;
  },
  swapSprites(spriteGroup: SpriteGroup, index1: number, index2: number) {
    [spriteGroup.sprites[index1], spriteGroup.sprites[index2]] = [spriteGroup.sprites[index2], spriteGroup.sprites[index1]];
  }
};
