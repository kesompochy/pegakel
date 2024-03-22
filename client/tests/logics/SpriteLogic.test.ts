import SpriteLogic from '~/logics/SpriteLogic';
import ColorState from '~/core/ColorState';

describe('SpriteLogic', () => {
  it("should create a new sprite", () => {
    const sprite = SpriteLogic.createSprite(10, 20);
    expect(sprite.width).toBe(10);
    expect(sprite.height).toBe(20);
  })
  it("should update a sprite", () => {
    const sprite = SpriteLogic.createSprite(10, 10);
    SpriteLogic.updateSprite(sprite, {
      x: 5,
      y: 7,
      color: new ColorState(100, 0, 0, 0
    }));
    expect(sprite.pixels[7][5]).toStrictEqual(new ColorState(100, 0, 0, 0));
    expect(sprite.pixels[5][5]).toStrictEqual(new ColorState(0, 0, 0, 0));
    expect(sprite.pixels[7][7]).toStrictEqual(new ColorState(0, 0, 0, 0));
  })
});
