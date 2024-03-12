import Canvas from "~/components/Canvas.vue";
import { mount } from "@vue/test-utils";

describe("canvas", () => {
  it("exists", async () => {
    expect("Canvas").toBe(Canvas.__name)
    const wrapper = mount(Canvas);
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
  it("has a canvas element", async () => {
    const wrapper = mount(Canvas);
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
  it("dispatch a function when the canvas is clicked", async () => {
    const wrapper = mount(Canvas);
    wrapper.find("canvas").trigger("click");
    expect(wrapper.emitted().click).toBeTruthy();
  });
});
