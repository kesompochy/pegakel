import { mount } from "@vue/test-utils";
import Preview from "~/components/Preview.vue"
import ColorState from "~/core/ColorState";

describe("Preview", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(Preview, {
      propsData: {
        sprites: [],
        name: "test",
        updateGroupName: () => {},
        palette: [new ColorState(0, 0, 0, 0)],
        acceptKeyInput: true,
      }
    });
  });
  afterEach(() => {
  });
  it("should render correctly", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
