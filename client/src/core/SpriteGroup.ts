export default class SpriteGroup {
  sprites: number[];
  name: string;
  constructor(name?: string) {
    name = name || 'undefined';
    this.name = name;
    this.sprites = [];
  }
}
