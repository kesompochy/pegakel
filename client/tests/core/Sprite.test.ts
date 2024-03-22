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
    expect(sprite.pixels).toEqual(new Array(10).fill(new Array(20).fill(new ColorState())));
  })
})
