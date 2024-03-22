import Sprite from '~/core/Sprite';
import ColorState from '~/core/ColorState';

describe('Sprite', () => {
  it("should have width and height", () => {
    const sprite = new Sprite(10, 20);
    expect(sprite.width).toBe(10);
    expect(sprite.height).toBe(20);
  })
  it("should have a pixel color state", () => {
    const sprite = new Sprite(10, 20);
    expect(sprite.pixels[0][0]).toStrictEqual(new ColorState(0, 0, 0, 0));
    expect(sprite.pixels[19][9]).toStrictEqual(new ColorState(0, 0, 0, 0));
    expect(sprite.pixels[20]).toBeUndefined();
    expect(sprite.pixels[10][20]).toBeUndefined();
  })
})
