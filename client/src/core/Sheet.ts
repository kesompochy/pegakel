import Sprite from "./Sprite";
import SpriteGroup from "./SpriteGroup";

export default class Sheet {
  sprites: Sprite[];
  name: string;
  groups: SpriteGroup[];
  constructor(name: string) {
    this.name = name;
    this.sprites = [];
    this.groups = [new SpriteGroup("default")];
  }
}
