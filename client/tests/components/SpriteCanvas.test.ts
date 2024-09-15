import SpriteCanvas from '~/components/SpriteCanvas.vue';
import { mount } from '@vue/test-utils';

describe('SpriteCanvas', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(SpriteCanvas);
  });
  afterEach(() => {
    wrapper.unmount();
  });
  it('has a canvas element', () => {
    expect(wrapper.find('canvas').exists()).toBe(true);
  });
});
