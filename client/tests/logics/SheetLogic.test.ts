import SheetLogic from "~/logics/SheetLogic";
import SpriteGroupLogic from "~/logics/SpriteGroupLogic";

describe("SheetLogic", () => {
  it("should create a new sheet", () => {
    const sheet = SheetLogic.createSheet("sheet");
    expect(sheet.name).toBe("sheet");
  });
  it("should init sheet with a sprite", () => {
    const sheet = SheetLogic.createSheet("sheet");
    SheetLogic.init(sheet);
    expect(sheet.sprites.length).toBe(1);
  });
  it("should add a sprite to the sheet", () => {
    const sheet = SheetLogic.createSheet("sheet");
    SheetLogic.init(sheet);
    SheetLogic.addSprite(sheet);
    expect(sheet.sprites.length).toBe(2);
  });
  it("should get clipped sprites belonging to a group", () => {
    const sheet = SheetLogic.createSheet("sheet");
    SheetLogic.init(sheet);
    SheetLogic.addSprite(sheet);
    SheetLogic.addSprite(sheet);
    SpriteGroupLogic.addSprite(sheet.groups[0], 0);
    SpriteGroupLogic.addSprite(sheet.groups[0], 1);
    SpriteGroupLogic.changeClipSize(sheet.groups[0], { width: 8, height: 8 });
    expect(SheetLogic.getClippedSpritesInGroup(sheet, 0).length).toBe(2);
  });
  it("should clone a sprite from a sprite", () => {
    const sheet = SheetLogic.createSheet("sheet");
    SheetLogic.init(sheet);
    SheetLogic.cloneSprite(sheet, 0);
    expect(sheet.sprites.length).toBe(2);
    expect(sheet.sprites[1]).toStrictEqual(sheet.sprites[0]);
  });
});
