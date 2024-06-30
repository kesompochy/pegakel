import ColorState from "~/core/ColorState";

describe("ColorState", () => {
  it("should have a color", () => {
    const colorState = new ColorState();
    expect(colorState.r).toBe(0);
    expect(colorState.g).toBe(0);
    expect(colorState.b).toBe(0);
    expect(colorState.a).toBe(0);
  });
  it("should have a color with values", () => {
    const colorState = new ColorState(255, 255, 255, 255);
    expect(colorState.r).toBe(255);
    expect(colorState.g).toBe(255);
    expect(colorState.b).toBe(255);
    expect(colorState.a).toBe(255);
  });
  it("should return a hex color", () => {
    const colorState = new ColorState(255, 255, 255, 255);
    expect(colorState.hex).toBe("#ffffff");
  });
  it("should return a hex color with leading zeros for small values", () => {
    const colorState = new ColorState(1, 1, 1, 1);
    expect(colorState.hex).toBe("#010101");
  });
  it("should return a hex capped at 255 when value is over 255", () => {
    const colorState = new ColorState(256, 256, 256, 256);
    expect(colorState.hex).toBe("#ffffff");
  });
});
