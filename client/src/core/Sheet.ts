import Sprite from "./Sprite";
import SpriteGroup from "./SpriteGroup";
import ISheet from "@shared/interfaces/Sheet";

export default class Sheet implements ISheet {
  sprites: Sprite[];
  name: string;
  groups: SpriteGroup[];
  constructor(name: string) {
    this.name = name;
    this.sprites = [];
    this.groups = [new SpriteGroup("default")];
  }
}
