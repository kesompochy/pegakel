import ToolBox from "~/components/SpriteEditor/ToolBox.vue";
import { mount } from "@vue/test-utils";
import type Tool from "~/core/Tool";

describe("ToolBox", () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(ToolBox, {
      propsData: {
        activeTool: "draw",
        handleChangeTool: (tool: Tool) => {},
      }
    });
  });
  it("should render the tool box", () => {
    expect(wrapper.find("div.toolbox").exists()).toBe(true);
  });
});
