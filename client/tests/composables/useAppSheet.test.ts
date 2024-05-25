import useAppSheet from "~/composables/useAppSheet";
import Sheet from "~/core/Sheet";

describe("useAppSheet", () => {
  let currentSheet: ReturnType<typeof useAppSheet>["currentSheet"];
  let currentSpriteId: ReturnType<typeof useAppSheet>["currentSpriteId"];

  beforeAll(() => {
    currentSheet = useAppSheet().currentSheet;
    currentSpriteId = useAppSheet().currentSpriteId;
  });

  it("should return a sheet object", () => {
    expect(currentSheet.value).toBeInstanceOf(Sheet);
  });
  it("should return a current selected sprite number", () => {
    expect(currentSpriteId.value).toBe(0);
  });
});
