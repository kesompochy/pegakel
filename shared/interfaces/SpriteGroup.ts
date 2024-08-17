import ColorState from './ColorState';

export default interface SpriteGroup {
  sprites: number[];
  name: string;
  palette: ColorState[];
}
