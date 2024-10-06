import ColorStateLogic from "~/logics/ColorState";
import ColorState from "~/core/ColorState";

describe("ColorStateLogic", () => {
  let colorState: ColorState;
  it("should culculate color hex", () => {
    colorState = new ColorState(100, 10, 200, 1);
    expect(ColorStateLogic.getHex(colorState)).toBe("#640ac8");
  });
  it("should return a hex color with leading zeros for small values", () => {
    const colorState = new ColorState(1, 1, 1, 1);
    expect(ColorStateLogic.getHex(colorState)).toBe("#010101");
  });
  it("should return a hex capped at 255 when value is over 255", () => {
    const colorState = new ColorState(256, 256, 256, 256);
    expect(ColorStateLogic.getHex(colorState)).toBe("#ffffff");
  });
  it("should return a rgba color", () => {
    const colorState = new ColorState(100, 10, 200, 0.5);
    expect(ColorStateLogic.getRgba(colorState)).toBe("rgba(100,10,200,0.5)");
  });
});
