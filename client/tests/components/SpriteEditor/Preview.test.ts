import { mount } from "@vue/test-utils";
import Preview from "~/components/SpriteEditor/Preview.vue"

describe("Preview", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(Preview);
  });
  afterEach(() => {
    wrapper.unmount();
  });
  it("should render correctly", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
