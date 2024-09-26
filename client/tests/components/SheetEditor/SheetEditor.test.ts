import SheetEditor from "~/components/SheetEditor/SheetEditor.vue";
import sheetLogics from "~/logics/SheetLogic";
import { mount } from "@vue/test-utils";

const sheet = sheetLogics.generateSheetForTest();
const props = {
  sheet: sheet,
  focusedSpriteInGroup: 0,
  handleChangeMode: vi.fn(),
  currentSpriteGroupId: 0,
  updateCurrentSpriteGroupId: vi.fn(),
};

describe("SheetEditor", () => {
  let wrapper: any;
  beforeAll(() => {
    wrapper = mount(SheetEditor, {
      props: props,
    });
  });
  it("should render sheet container div element", () => {
    expect(wrapper.find("div.sheet-container").exists()).toBe(true);
  });
});
