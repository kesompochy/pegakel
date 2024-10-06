import ColorState from "./ColorState";

export default interface Sprite {
  width: number;
  height: number;
  pixels: ColorState[][];
  clipX: number;
  clipY: number;
}
