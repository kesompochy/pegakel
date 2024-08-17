import ColorState from "~/core/ColorState";
import ISpriteGroup from "@shared/interfaces/SpriteGroup"

export default class SpriteGroup implements ISpriteGroup {
  sprites: number[];
  name: string;
  palette: ColorState[];
  constructor(name?: string) {
    name = name || "undefined";
    this.name = name;
    this.sprites = [];
    this.palette = [];
  }
}
