import ISpriteGroup from "@shared/interfaces/SpriteGroup"

export default class SpriteGroup implements ISpriteGroup {
  sprites: number[];
  name: string;
  clipSize: { width: number; height: number } | undefined;
  constructor(name?: string) {
    name = name || "undefined";
    this.name = name;
    this.sprites = [];
  }
}
