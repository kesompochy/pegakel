import Sprite from "./Sprite";
import SpriteGroup from "./SpriteGroup";
import ISheet from "@shared/interfaces/Sheet";
import ColorState from "./ColorState";

export default class Sheet implements ISheet {
  sprites: Sprite[];
  name: string;
  groups: SpriteGroup[];
  palette: ColorState[];
  constructor(name: string) {
    this.name = name;
    this.sprites = [];
    this.groups = [new SpriteGroup("default")];
    this.palette = [
      new ColorState(0, 0, 0, 0),
      new ColorState(100, 100, 100, 1),
      new ColorState(255, 255, 255, 1),
      new ColorState(255, 0, 0, 1),
      new ColorState(0, 255, 0, 1),
      new ColorState(0, 0, 255, 1),
      new ColorState(255, 255, 0, 1),
      new ColorState(255, 0, 255, 1),
      new ColorState(0, 255, 255, 1),
    ];
  }
}
