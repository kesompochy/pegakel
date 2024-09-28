import Sprite from './Sprite';
import SpriteGroup from './SpriteGroup';
import ColorState from './ColorState';

export default interface Sheet {
  sprites: Sprite[];
  name: string;
  groups: SpriteGroup[];
  palette: ColorState[];
}
