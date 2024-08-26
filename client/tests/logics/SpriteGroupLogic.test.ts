import SpriteGroupLogic from '~/logics/SpriteGroupLogic';

describe('SpriteGroupLogic', () => {
  it("should create a new sprite group", () => {
    const spriteGroup = SpriteGroupLogic.createSpriteGroup('test');
    expect(spriteGroup.sprites).toEqual([]);
  })
  it("should add a sprite", () => {
    const spriteGroup = SpriteGroupLogic.createSpriteGroup('test');
    SpriteGroupLogic.addSprite(spriteGroup, 0);
    expect(spriteGroup.sprites).toEqual([0]);
  });
  it("should change clip width or height", () => {
    const spriteGroup = SpriteGroupLogic.createSpriteGroup('test');
    SpriteGroupLogic.changeClipSize(spriteGroup, { width: 10, height: 20 });
    expect(spriteGroup.clipSize).toEqual({ width: 10, height: 20 });
  });
})
