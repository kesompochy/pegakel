import Palette from "~/components/SpriteEditor/Palette.vue";
import { shallowMount } from "@vue/test-utils";

describe("Palette", () => {
  let wrapper = shallowMount(Palette, {
    props: {
      colors: [],
      handleChoosePaletteCell: () => {},
      activeColor: 0,
      activeTool: "draw",
      handleUpdatePalette: () => {},
    },
  });
  it("is should have a div element", () => {
    expect(wrapper.find("div").exists()).toBe(true);
  });
  it("should have color cells", () => {
    expect(wrapper.find(".color-cell").exists()).toBe(true);
  });
});
