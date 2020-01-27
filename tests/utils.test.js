const utils = require("../utils");
describe("Utils", () => {
  test("test create room1", async () => {
    const arr = ["Qd", "Kd", "Ac", "2c"];
    utils.sortCards(arr);
    expect(arr).toEqual(["Ac", "Kd", "Qd", "2c"]);
  });
});
