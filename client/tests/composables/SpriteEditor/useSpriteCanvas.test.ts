import useSpriteCanvas from '~/composables/SpriteEditor/useSpriteCanvas';
import Sprite from '~/core/Sprite';
import ColorState from '~/core/ColorState';

describe('SpriteCanvas', () => {
  it("should have a Sprite", () => {
    const { sprite } = useSpriteCanvas({ width: 16, height: 16 });
    expect(sprite.value).toBeInstanceOf(Sprite);
  });
  it("should update the Sprite", () => {
    const { sprite, updateSprite } = useSpriteCanvas({ width: 16, height: 16 });
    updateSprite(2, 2, new ColorState(0, 0, 0, 1));
    expect(sprite.value.pixels[2][2]).toEqual(new ColorState(0, 0, 0, 1));
  })
})
