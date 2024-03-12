import Canvas from "~/components/Canvas.vue";
import { shallowMount } from "@vue/test-utils";

describe("canvas", () => {
  it("canvas", async () => {
    expect("Canvas").toBe(Canvas.__name)
    const wrapper = shallowMount(Canvas);
    expect(wrapper).toBeTruthy();
  });
});
