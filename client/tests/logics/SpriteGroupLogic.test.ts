import SpriteGroupLogic from '~/logics/SpriteGroupLogic';

describe('SpriteGroupLogic', () => {
  it("should create a new sprite group", () => {
    const spriteGroup = SpriteGroupLogic.createSpriteGroup('test');
    expect(spriteGroup.sprites).toEqual([]);
  })
})
