import Sheet from "~/components/SheetEditor/Sheet.vue";
import SheetObject from "~/core/Sheet";
import { mount } from "@vue/test-utils";

describe("Sheet", () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(Sheet, {
      propsData: {
        sheet: new SheetObject("test"),
        focusedSpriteInGroup: 0,
      }
    });
  });
  it("should render sheet container div element", () => {
    expect(wrapper.find("div.sheet-container").exists()).toBe(true);
  });
});
