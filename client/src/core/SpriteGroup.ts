import ColorState from "~/core/ColorState";
export default class SpriteGroup {
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
