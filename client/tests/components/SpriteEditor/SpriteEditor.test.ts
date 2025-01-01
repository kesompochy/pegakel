import SpriteEditor from "~/components/SpriteEditor/SpriteEditor.vue";
import { mount } from "@vue/test-utils";
import Sprite from "~/core/Sprite";
import SpriteGroup from "~/core/SpriteGroup";
import { MockInstance } from "vitest";

describe("SpriteEditor", () => {
  let wrapper: any;
  let addEventListenerSpy: MockInstance;
  let removeEventListenerSpy: MockInstance;

  beforeAll(() => {
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    wrapper = mount(SpriteEditor, {
      propsData: {
        handleChangeMode: () => {},
        spriteGroup: new SpriteGroup(),
        sprite: new Sprite(16, 16),
        spriteId: 0,
        updateSprite: () => {},
        updateSpriteSize: () => {},
        updateClipSize: () => {},
        groupSprites: [],
        updatePalette: () => {},
        palette: [],
        scale: 100,
        acceptKeyInput: true,
      },
    });
  });
  afterAll(() => {
    wrapper.unmount();
    vi.restoreAllMocks();
  });
  it("should render sprite canvas", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
  it("should render palette", () => {
    expect(wrapper.find(".palette-container").exists()).toBe(true);
  });
  it("should render the tool box", () => {
    expect(wrapper.find(".toolbox").exists()).toBe(true);
  });
  it("should add event listener", () => {
    expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
  it("should remove event listener", () => {
    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
});
