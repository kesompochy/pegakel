import App from "~/App.vue";
import { mount } from "@vue/test-utils";

describe("App", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(App);
  });
  it("should render mode text", () => {
    expect(wrapper.find("h1").text()).toContain("MODE");
  });
  it("should render canvas in Sprite Editor mode", async () => {
    wrapper.vm.setMode(wrapper.vm.modes.SPRITE_EDITOR);
    await wrapper.vm.$nextTick();
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
