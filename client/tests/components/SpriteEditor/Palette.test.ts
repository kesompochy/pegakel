import Palette from '~/components/SpriteEditor/Palette.vue'
import { shallowMount } from '@vue/test-utils'

describe('Palette', () => {
  it('is should have a div element', () => {
    const wrapper = shallowMount(Palette)
    expect(wrapper.find('div').exists()).toBe(true)
  })
})
