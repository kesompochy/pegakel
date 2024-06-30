import ColorState from "./ColorState";

export default class Sprite {
  width: number;
  height: number;
  pixels: ColorState[][];
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = Array.from({ length: height }, () => Array(width).fill(new ColorState(0, 0, 0, 0)));
  }
}
