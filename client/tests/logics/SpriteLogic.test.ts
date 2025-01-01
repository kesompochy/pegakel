import SpriteLogic from '~/logics/SpriteLogic';
import ColorState from '~/core/ColorState';
import Sprite from '~/core/Sprite';

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
      color: 1
    });
    expect(sprite.pixels[7][5]).toStrictEqual(1);
    expect(sprite.pixels[5][5]).toStrictEqual(0);
    expect(sprite.pixels[7][7]).toStrictEqual(0);
  })
  it("should change clip x or y", () => {
    const sprite = SpriteLogic.createSprite(10, 10);
    SpriteLogic.changeClip(sprite, { x: 5, y: 7 });
    expect(sprite.clipX).toBe(5);
    expect(sprite.clipY).toBe(7);
  });
  describe("update sprite size", () => {
    let sprite: Sprite;
    beforeEach(() => {
      sprite = SpriteLogic.createSprite(10, 10);
      sprite.pixels[0][0] = 1;
      sprite.pixels[9][9] = 2;
      sprite.pixels[0][9] = 3;
      sprite.pixels[9][0] = 4;  
    });
    it("should update with no change", () => {
      SpriteLogic.updateSpriteSize(sprite, 0, 0, 0, 0);
      expect(sprite.width).toBe(10);
      expect(sprite.height).toBe(10);
      expect(sprite.pixels[0][0]).toStrictEqual(1);
      expect(sprite.pixels[9][9]).toStrictEqual(2);
      expect(sprite.pixels[0][9]).toStrictEqual(3);
      expect(sprite.pixels[9][0]).toStrictEqual(4);
    });
    it("should update sprite to be larger", () => {
      SpriteLogic.updateSpriteSize(sprite, 1, 1, 1, 1);
      expect(sprite.width).toBe(12);
      expect(sprite.height).toBe(12);
      expect(sprite.pixels[0][0]).toStrictEqual(0);
      expect(sprite.pixels[11][11]).toStrictEqual(0);
      expect(sprite.pixels[1][1]).toStrictEqual(1);
      expect(sprite.pixels[10][10]).toStrictEqual(2);
      expect(sprite.pixels[1][10]).toStrictEqual(3);
      expect(sprite.pixels[10][1]).toStrictEqual(4);
    });
    it("should update sprite to be smaller", () => {
      SpriteLogic.updateSpriteSize(sprite, -1, -1, -1, -1);
      expect(sprite.width).toBe(8);
      expect(sprite.height).toBe(8);
      expect(sprite.pixels[0][0]).toStrictEqual(0);
      expect(sprite.pixels[7][7]).toStrictEqual(0)
      expect(sprite.pixels[0][7]).toStrictEqual(0);
      expect(sprite.pixels[7][0]).toStrictEqual(0);
    });
    it("should update sprite clip coordinates when sprite size is updated", () => {
      SpriteLogic.updateSpriteSize(sprite, 1, 2, 0, 0);
      expect(sprite.clipX).toBe(1);
      expect(sprite.clipY).toBe(2);
      SpriteLogic.updateSpriteSize(sprite, -1, -1, 0, 0);
      expect(sprite.clipX).toBe(0);
      expect(sprite.clipY).toBe(1); 
    });
  });
  it("should generate clipped sprite", () => {
    const sprite = SpriteLogic.createSprite(10, 10);
    SpriteLogic.updateSprite(sprite, { x: 0, y: 0, color: 1 });
    sprite.clipX = 1;
    sprite.clipY = 1;
    const clippedSprite = SpriteLogic.generateClippedSprite(sprite, 5, 5);
    expect(clippedSprite.width).toBe(5);
    expect(clippedSprite.height).toBe(5);
    expect(clippedSprite.pixels[0][0]).toStrictEqual(0);
  });
});
