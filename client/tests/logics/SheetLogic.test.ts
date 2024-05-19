import SheetLogic from "~/logics/SheetLogic";

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
});
