import ColorSelector from "~/components/SpriteEditor/ColorSelector.vue";
import { mount } from "@vue/test-utils";
import ColorState from "~/core/ColorState";

describe("ColorSelector", () => {
  let wrapper = mount(ColorSelector, {
    props: {
      currentColor: new ColorState(),
      handleConfirmColor: () => {},
    },
    global: {
      stubs: {},
    },
  });
  it("should render div element", () => {
    expect(wrapper.find("div").exists()).toBe(true);
  });
});
