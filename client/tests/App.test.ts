import App from "~/App.vue";
import { mount } from "@vue/test-utils";
import { modes } from "~/composables/useAppMode";
import ColorState from "~/core/ColorState";
import SpriteEditor from "~/components/SpriteEditor/SpriteEditor.vue";
import Palette from "~/components/SpriteEditor/Palette.vue";

describe("App", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(App);
  });
  it("should render mode text", () => {
    expect(wrapper.find("h1").text()).toContain("MODE");
  });
  it("should render canvas in Sprite Editor mode", async () => {
    wrapper.vm.setMode(modes.SPRITE_EDITOR);
    await wrapper.vm.$nextTick();
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
  it("should have some sheet after init for test", () => {
    wrapper.vm.initSheetForTest();
    expect(wrapper.vm.currentSheet.sprites[0].pixels[0][0]).toBeInstanceOf(ColorState);
    expect(wrapper.vm.currentSheet.groups[0].palette[0]).toBeInstanceOf(ColorState);
  });
  describe("exporting and importing sheet", () => {
    it("should export json string that can be imported", () => {
      wrapper.vm.initSheetForTest();
      const originalSheet = wrapper.vm.currentSheet;
      const json = wrapper.vm.generateExportingString();
      wrapper.vm.updateSheet(JSON.parse(json));
      const importedSheet = wrapper.vm.currentSheet;
      expect(importedSheet).toEqual(originalSheet);
    });
    it("should render palette after importing", () => {
      wrapper.vm.setMode(modes.SPRITE_EDITOR);
      wrapper.vm.initSheetForTest();
      wrapper.vm.$nextTick();
      const json = wrapper.vm.generateExportingString();
      wrapper.vm.updateSheet(JSON.parse(json));
      wrapper.vm.$nextTick();
      const color = wrapper.vm.currentSheet.groups[0].palette[0];
      const paletteCells = wrapper.findAll("div.color-cell");
    });
  });
});
