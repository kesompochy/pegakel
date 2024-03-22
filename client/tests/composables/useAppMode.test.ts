import useAppMode from '~/composables/useAppMode'

describe('useAppMode', () => {
  it("should initialize with default mode", () => {
    const { currentMode, modes } = useAppMode();
    expect(currentMode.value).toBe(modes.sprite);
  })
  it("should change mode", () => {
    const { currentMode, setMode, modes } = useAppMode();
    setMode(modes.sheet);
    expect(currentMode.value).toBe(modes.sheet);
  })
  it("should not allow setting invalid mode", () => {
    const { currentMode, setMode, modes } = useAppMode();
    expect(()=>setMode("invalid" as any)).toThrowError();
  })
})

