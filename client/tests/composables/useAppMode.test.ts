import useAppMode from "~/composables/useAppMode";
import SpriteEditor from "~/components/SpriteEditor/SpriteEditor.vue";
import SheetEditor from "~/components/SheetEditor/SheetEditor.vue";

describe("useAppMode", () => {
  it("should initialize with default mode", () => {
    const { currentMode, currentComponent } = useAppMode();
    expect(currentComponent.value).toStrictEqual(SpriteEditor);
    expect(currentMode.value).toBe("SpriteEditor");
  });
  it("should change mode", () => {
    const { currentMode, setMode, modes, currentComponent } = useAppMode();
    setMode(modes.SHEET_EDITOR);
    expect(currentComponent.value).toStrictEqual(SheetEditor);
    expect(currentMode.value).toBe("SheetEditor");
  });
  it("should not allow setting invalid mode", () => {
    const { setMode } = useAppMode();
    expect(() => setMode("invalid" as any)).toThrowError();
  });
});
