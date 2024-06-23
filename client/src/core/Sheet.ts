import Sprite from "./Sprite";
import SpriteGroup from "./SpriteGroup";

export default class Sheet {
  sprites: Sprite[];
  name: string;
  groups: { [key: string]: SpriteGroup };
  constructor(name: string) {
    this.name = name;
    this.sprites = [];
    this.groups = {};
  }
}
