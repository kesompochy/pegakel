import ColorState from "~/core/ColorState";
import ISpriteGroup from "@shared/interfaces/SpriteGroup"

export default class SpriteGroup implements ISpriteGroup {
  sprites: number[];
  name: string;
  palette: ColorState[];
  clipSize: { width: number; height: number };
  constructor(name?: string) {
    name = name || "undefined";
    this.name = name;
    this.sprites = [];
    this.palette = [];
    this.clipSize = { width: 0, height: 0 };
  }
}
