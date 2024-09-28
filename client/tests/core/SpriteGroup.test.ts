import SpriteGroup from "~/core/SpriteGroup";

describe("SpriteGroup", () => {
  it("should have a name", () => {
    const spriteGroup = new SpriteGroup("test");
    expect(spriteGroup.name).toBe("test");
  });
  it("should have sprites", () => {
    const spriteGroup = new SpriteGroup("test");
    expect(spriteGroup.sprites).toEqual([]);
  });
  it("should have a clip size", () => {
    const spriteGroup = new SpriteGroup("test");
    expect(spriteGroup.clipSize).toEqual(undefined);
  });
});
