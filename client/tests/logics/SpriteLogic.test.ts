import SpriteLogic from '~/logics/SpriteLogic';

describe('SpriteLogic', () => {
  it("should create a new sprite", () => {
    const sprite = SpriteLogic.createSprite(10, 20);
    expect(sprite.width).toBe(10);
    expect(sprite.height).toBe(20);
  })
});
