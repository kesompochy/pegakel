import useSheet from "~/composables/SheetEditor/useSheet";

describe("useSheetEditor", () => {
  it("should have a focused sprite", () => {
    const { focusedSprite } = useSheet();
    expect(focusedSprite.value).toBeDefined();
  });
});
