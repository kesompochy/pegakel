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
  it("should have some sheet after init for test", () => {
    wrapper.vm.initSheetForTest();
    expect(wrapper.vm.currentSheet.sprites[0].pixels[0][0]).toBeInstanceOf(ColorState);
    expect(wrapper.vm.currentSheet.groups[0].palette[0]).toBeInstanceOf(ColorState);
  });
});
