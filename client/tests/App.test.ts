import App from "~/App.vue";
import { mount } from "@vue/test-utils";

describe("App", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(App);
  });
  it("should render mode text", () => {
    expect(wrapper.find("h1").text()).toBe("MODE: SpriteEditor");
  });
  it("should render canvas in Sprite Editor mode", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
