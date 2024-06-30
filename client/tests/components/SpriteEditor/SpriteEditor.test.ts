import SpriteEditor from "~/components/SpriteEditor/SpriteEditor.vue";
import { mount } from "@vue/test-utils";
import Sprite from "~/core/Sprite";
import SpriteGroup from "~/core/SpriteGroup";

describe("SpriteEditor", () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(SpriteEditor, {
      props: {
        handleChangeMode: () => {},
        spriteGroup: new SpriteGroup(),
        sprite: new Sprite(16, 16),
        spriteId: 0,
      },
    });
  });
  it("should render sprite canvas", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
  it("should render palette", () => {
    expect(wrapper.find(".palette").exists()).toBe(true);
  });
  it("should render the tool box", () => {
    expect(wrapper.find(".toolbox").exists()).toBe(true);
  });
});
