import App from "~/App.vue";
import { mount, VueWrapper } from "@vue/test-utils";
import { modes } from "~/composables/useAppMode";
import ColorState from "~/core/ColorState";

describe("App", () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    wrapper = mount(App);
  });
  afterEach(() => {
    wrapper.unmount();
    vi.restoreAllMocks();
  });
  it("should render canvas in Sprite Editor mode", async () => {
    wrapper.vm.setMode(modes.SPRITE_EDITOR);
    await wrapper.vm.$nextTick();
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
