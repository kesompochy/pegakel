import Sprite from './Sprite';
import SpriteGroup from './SpriteGroup';

export default interface Sheet {
  sprites: Sprite[];
  name: string;
  groups: SpriteGroup[];
}
