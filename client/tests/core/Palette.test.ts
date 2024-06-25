import Palette from "~/core/Palette";
import ColorState from "~/core/ColorState";

describe("Palette", () => {
  let palette: Palette;
  beforeEach(() => {
    palette = new Palette();
  });
  it("should return a color", () => {
    expect(palette).toBeDefined();
  });
  it("should have colors", () => {
    expect(palette.colors).toStrictEqual([]);;
  });
});
