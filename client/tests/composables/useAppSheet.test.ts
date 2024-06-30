import useAppSheet from "~/composables/useAppSheet";
import Sheet from "~/core/Sheet";

describe("useAppSheet", () => {
  let currentSheet: ReturnType<typeof useAppSheet>["currentSheet"];
  let currentSpriteId: ReturnType<typeof useAppSheet>["currentSpriteId"];
  let currentSpriteGroupId: ReturnType<typeof useAppSheet>["currentSpriteGroupId"];

  beforeAll(() => {
    currentSheet = useAppSheet().currentSheet;
    currentSpriteId = useAppSheet().currentSpriteId;
    currentSpriteGroupId = useAppSheet().currentSpriteGroupId;
  });

  it("should return a sheet object", () => {
    expect(currentSheet.value).toBeInstanceOf(Sheet);
  });
  it("should return a current selected sprite number", () => {
    expect(currentSpriteId.value).toBe(0);
  });
  it("shoud return a current sprite group", () => {
    expect(currentSpriteGroupId.value).toBe(0);
  });
});
