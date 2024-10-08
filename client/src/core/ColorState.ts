import IColorState from "@shared/interfaces/ColorState";

export default class ColorState implements IColorState {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}
