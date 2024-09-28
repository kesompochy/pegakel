import SpriteGroup from "~/core/SpriteGroup";
import ColorState from "~/core/ColorState";

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
};
