import useSheet from "~/composables/SheetEditor/useSheet";

describe("useSheetEditor", () => {
  it("should have a focused sprite", () => {
    const { focusedSprite } = useSheet();
    expect(focusedSprite.value).toBeDefined();
  });
  it("should update the focused sprite", () => {
    const { focusedSprite, updateFocusedSprite } = useSheet();
    updateFocusedSprite(2);
    expect(focusedSprite.value).toBe(2);
  });
});
