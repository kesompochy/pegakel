import SpriteCanvas from "~/components/SpriteEditor/SpriteCanvas.vue";
import { shallowMount } from "@vue/test-utils";

describe("SpriteCanvas", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = shallowMount(SpriteCanvas);
  });
  it("should have a canvas", () => {
    const wrapper = shallowMount(SpriteCanvas);
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
  it("should manipulate with key action", () => {
    const cellX = wrapper.vm.manipulatingCell.x;
    const cellY = wrapper.vm.manipulatingCell.y;
    wrapper.vm.editorActions["moveUp"]();
    expect(wrapper.vm.manipulatingCell.x).toBe(cellX);
    expect(wrapper.vm.manipulatingCell.y).toBe(cellY - 1);
    wrapper.vm.editorActions["moveDown"]();
    expect(wrapper.vm.manipulatingCell.x).toBe(cellX);
    expect(wrapper.vm.manipulatingCell.y).toBe(cellY);
    wrapper.vm.editorActions["moveLeft"]();
    expect(wrapper.vm.manipulatingCell.x).toBe(cellX - 1);
    expect(wrapper.vm.manipulatingCell.y).toBe(cellY);
    wrapper.vm.editorActions["moveRight"]();
    expect(wrapper.vm.manipulatingCell.x).toBe(cellX);
    expect(wrapper.vm.manipulatingCell.y).toBe(cellY);
    wrapper.vm.editorActions["moveRight"]();
    expect(wrapper.vm.manipulatingCell.x).toBe(cellX + 1);
    expect(wrapper.vm.manipulatingCell.y).toBe(cellY);
  });
});
