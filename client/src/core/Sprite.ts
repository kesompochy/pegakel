import ISprite from "@shared/interfaces/Sprite";

export default class Sprite implements ISprite {
  width: number;
  height: number;
  pixels: number[][];
  clipX: number = 0;
  clipY: number = 0;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = Array.from({ length: height }, () => Array(width).fill(0));
  }
}
