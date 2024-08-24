import Sheet from "~/components/SheetEditor/Sheet.vue";
import SheetObject from "~/core/Sheet";
import { mount } from "@vue/test-utils";

describe("Sheet", () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(Sheet, {
      propsData: {
        sheet: new SheetObject("test"),
        focusedSprite: 0,
      }
    });
  });
  it("should render sheet container div element", () => {
    expect(wrapper.find("div.sheet-container").exists()).toBe(true);
  });
  it("should render sheet canvas element", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
