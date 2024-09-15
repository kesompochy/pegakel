import SpriteCanvas from '~/components/SpriteCanvas.vue';
import { mount } from '@vue/test-utils';
import Sprite from '~/core/Sprite';

describe('SpriteCanvas', () => {
  let wrapper: any;
  beforeEach(() => {
    const props = {
      width: 100,
      sprite: new Sprite(10, 10)
    }
    wrapper = mount(SpriteCanvas, {
      props
    });
  });
  afterEach(() => {
    wrapper.unmount();
  });
  it('has a canvas element', () => {
    expect(wrapper.find('canvas').exists()).toBe(true);
  });
});
