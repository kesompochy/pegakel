import useSpriteEditor from "~/composables/SpriteEditor/useSpriteEditor";

describe("useSprite", () => {
  it("should return a active color", () => {
    const { activeColor } = useSpriteEditor();
    expect(activeColor.value).toBe(0);
  });
  it("should update the active color", () => {
    const { activeColor, updateActiveColor } = useSpriteEditor();
    updateActiveColor(1);
    expect(activeColor.value).toBe(1);
  });
  it("should return a active tool", () => {
    const { activeTool } = useSpriteEditor();
    expect(activeTool.value).toBe("draw");
  });
  it("should update the active tool", () => {
    const { activeTool, updateActiveTool } = useSpriteEditor();
    updateActiveTool("erase");
    expect(activeTool.value).toBe("erase");
  });
  it("should return a manipulation mode", () => {
    const { manipulationMode } = useSpriteEditor();
    expect(manipulationMode.value).toBe("key");
  });
  it("should update the manipulation mode", () => {
    const { manipulationMode, updateManipulationMode } = useSpriteEditor();
    updateManipulationMode("touch");
    expect(manipulationMode.value).toBe("touch");
  });
});
