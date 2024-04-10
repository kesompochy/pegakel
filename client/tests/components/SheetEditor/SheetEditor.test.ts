import SheetEditor from "~/components/SheetEditor/SheetEditor.vue";
import { mount } from "@vue/test-utils";

describe("SheetEditor", () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(SheetEditor);
  });
  it("should render sheet container div element", () => {
    expect(wrapper.find("div.sheet-container").exists()).toBe(true);
  });
  it("should render sheet canvas element", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
