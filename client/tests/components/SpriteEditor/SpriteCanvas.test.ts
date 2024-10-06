import SpriteCanvas from "~/components/SpriteEditor/SpriteCanvas.vue";
import { mount } from "@vue/test-utils";
import Sprite from "~/core/Sprite";

describe("SpriteCanvas", () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(SpriteCanvas, {
      propsData: {
        updateManipulationMode: () => {},
        updateSprite: () => {},
        focused: true, 
        sprite: new Sprite(16, 16),
        activeColorState: { r: 0, g: 0, b: 0, a: 1 },
        activeTool: "draw",
        manipulationMode: "key",
        clipSize: undefined,
        scale: 100,
      }
    });
  });
  it("should have a canvas", () => {
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
  it("should manipulate with key action", () => {
    wrapper.vm.manipulatingCell = { x: 1, y: 1 };
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
