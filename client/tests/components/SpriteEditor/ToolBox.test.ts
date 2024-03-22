import ToolBox from "~/components/SpriteEditor/ToolBox.vue";
import { mount } from "@vue/test-utils";

describe("ToolBox", () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(ToolBox);
  });
  it("should render the tool box", () => {
    expect(wrapper.find("div.toolbox").exists()).toBe(true);
  });
});
