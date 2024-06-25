import Sheet from "~/core/Sheet";

describe("Sheet", () => {
  it("should have name", () => {
    const sheet = new Sheet("test");
    expect(sheet.name).toBe("test");
  });
  it("should have sprites", () => {
    const sheet = new Sheet("test");
    expect(sheet.sprites).toEqual([]);
  });
  it("should have groups", () => {
    const sheet = new Sheet("test");
    expect(sheet.groups).toBeInstanceOf(Array);
  });
  it("should have one or more groups", () => {
    const sheet = new Sheet("test");
    expect(sheet.groups.length).toBeGreaterThan(0);
  });
});
