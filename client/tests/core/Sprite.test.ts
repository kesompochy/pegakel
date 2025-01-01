import Sprite from "~/core/Sprite";

describe("Sprite", () => {
  it("should have width and height", () => {
    const sprite = new Sprite(10, 20);
    expect(sprite.width).toBe(10);
    expect(sprite.height).toBe(20);
  });
  it("should have a pixel color state", () => {
    const sprite = new Sprite(10, 20);
    expect(sprite.pixels[0][0]).toStrictEqual(0);
    expect(sprite.pixels[19][9]).toStrictEqual(0);
    expect(sprite.pixels[20]).toBeUndefined();
    expect(sprite.pixels[10][20]).toBeUndefined();
  });
  it("should have clip x and y", () => {
    const sprite = new Sprite(10, 20);
    expect(sprite.clipX).toBe(0);
    expect(sprite.clipY).toBe(0);
  });
});
