import Sprite from "./Sprite";
import SpriteGroup from "./SpriteGroup";

export default class Sheets {
  sprites: Sprite[];
  name: string;
  groups: { [key: string]: SpriteGroup };
  constructor(name: string) {
    this.name = name;
    this.sprites = [];
    this.groups = {};
  }
  init() {
    const initSprite = new Sprite(16, 16);
    this.sprites.push(initSprite);
  }
}
