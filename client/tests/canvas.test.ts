import Canvas from "~/components/Canvas.vue";
import { mount } from "@vue/test-utils";

describe("canvas", () => {
  it("canvas", async () => {
    expect("Canvas").toBe(Canvas.__name)
    const wrapper = mount(Canvas);
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
