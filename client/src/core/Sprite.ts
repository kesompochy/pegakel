import ColorState from './ColorState';

export default class Sprite {
  width: number;
  height: number;
  pixels: ColorState[][];
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = new Array(width).fill(new Array(height).fill(new ColorState()));
  }
}
