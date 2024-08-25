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
      color: new ColorState(100, 0, 0, 0)
    });
    expect(sprite.pixels[7][5]).toStrictEqual(new ColorState(100, 0, 0, 0));
    expect(sprite.pixels[5][5]).toStrictEqual(new ColorState(0, 0, 0, 0));
    expect(sprite.pixels[7][7]).toStrictEqual(new ColorState(0, 0, 0, 0));
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
      sprite.pixels[0][0] = new ColorState(100, 0, 0, 1);
      sprite.pixels[9][9] = new ColorState(0, 100, 0, 1);
      sprite.pixels[0][9] = new ColorState(0, 0, 100, 1);
      sprite.pixels[9][0] = new ColorState(5, 0, 0, 1);  
    });
    it("should update with no change", () => {
      SpriteLogic.updateSpriteSize(sprite, 0, 0, 0, 0);
      expect(sprite.width).toBe(10);
      expect(sprite.height).toBe(10);
      expect(sprite.pixels[0][0]).toStrictEqual(new ColorState(100, 0, 0, 1));
      expect(sprite.pixels[9][9]).toStrictEqual(new ColorState(0, 100, 0, 1));
      expect(sprite.pixels[0][9]).toStrictEqual(new ColorState(0, 0, 100, 1));
      expect(sprite.pixels[9][0]).toStrictEqual(new ColorState(5, 0, 0, 1));
    });
    it("should update sprite to be larger", () => {
      SpriteLogic.updateSpriteSize(sprite, 1, 1, 1, 1);
      expect(sprite.width).toBe(12);
      expect(sprite.height).toBe(12);
      expect(sprite.pixels[0][0]).toStrictEqual(new ColorState(0, 0, 0, 0));
      expect(sprite.pixels[11][11]).toStrictEqual(new ColorState(0, 0, 0, 0));
      expect(sprite.pixels[1][1]).toStrictEqual(new ColorState(100, 0, 0, 1));
      expect(sprite.pixels[10][10]).toStrictEqual(new ColorState(0, 100, 0, 1));
      expect(sprite.pixels[1][10]).toStrictEqual(new ColorState(0, 0, 100, 1));
      expect(sprite.pixels[10][1]).toStrictEqual(new ColorState(5, 0, 0, 1));
    });
    it("should update sprite to be smaller", () => {
      SpriteLogic.updateSpriteSize(sprite, -1, -1, -1, -1);
      expect(sprite.width).toBe(8);
      expect(sprite.height).toBe(8);
      expect(sprite.pixels[0][0]).toStrictEqual(new ColorState(0, 0, 0, 0));
      expect(sprite.pixels[7][7]).toStrictEqual(new ColorState(0, 0, 0, 0));
      expect(sprite.pixels[0][7]).toStrictEqual(new ColorState(0, 0, 0, 0));
      expect(sprite.pixels[7][0]).toStrictEqual(new ColorState(0, 0, 0, 0));
    });
  });
});
