import { mount } from "@vue/test-utils";
import Preview from "~/components/Preview.vue"

describe("Preview", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(Preview, {
      propsData: {
        sprites: [],
      }
    });
  });
  afterEach(() => {
  });
  it("should render correctly", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
