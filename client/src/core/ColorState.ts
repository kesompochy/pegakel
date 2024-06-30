export default class ColorState {
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
  private toHex(value: number) {
    return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
  }
  get hex() {
    return `#${this.toHex(this.r)}${this.toHex(this.g)}${this.toHex(this.b)}`;
  }
}
