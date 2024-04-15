import Sheet from "~/components/SheetEditor/Sheet.vue";
import { mount } from "@vue/test-utils";

describe("Sheet", () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(Sheet);
  });
  it("should render sheet container div element", () => {
    expect(wrapper.find("div.sheet-container").exists()).toBe(true);
  });
  it("should render sheet canvas element", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
