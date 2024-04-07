import useAppSheet from "~/composables/useAppSheet";
import { ref } from "vue";
import Sheet from "~/core/Sheet";

describe("useAppSheet", () => {
  let currentSheet: ReturnType<typeof useAppSheet>["currentSheet"];
  let currentSpriteNumber: ReturnType<typeof useAppSheet>["currentSpriteNumber"];

  beforeAll(() => {
    currentSheet = useAppSheet().currentSheet;
    currentSpriteNumber = useAppSheet().currentSpriteNumber;
  });

  it("should return a sheet object", () => {
    expect(currentSheet.value).toBeInstanceOf(Sheet);
  });
  it("should return a current selected sprite number", () => {
    expect(currentSpriteNumber.value).toBe(0);
  });
});
