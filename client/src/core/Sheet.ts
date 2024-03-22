import Sprite from './Sprite';
import SpriteGroup from './SpriteGroup';

export default class Sheets {
  sprites: Sprite[];
  name: string;
  groups: { [key: string]: SpriteGroup };
  constructor(name: string) {
    this.name = name;
    this.sprites = [];
    this.groups = {};
  }
  addSprite(width: number, height: number) {
    this.sprites.push(new Sprite(width, height));
  }
  createGroup(name: string) {
    this.groups[name] = new SpriteGroup(name);
  }
}

