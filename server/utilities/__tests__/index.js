jest.mock("../uaParser");
jest.mock("../urlChecker");
const { removeTrailingSlashes, replaceAll } = require("../index");

describe("utilities", () => {
  describe("removeTrailingSlashes", () => {
    test("should strip a single trailing slash from a string", () => {
      const result = removeTrailingSlashes("https://lukeb.co.uk/");

      expect(result).toBe("https://lukeb.co.uk");
    });

    test("should strip multiple trailing slashes from a string", () => {
      const result = removeTrailingSlashes("https://lukeb.co.uk/////");

      expect(result).toBe("https://lukeb.co.uk");
    });

    test("should return the same string if there are no trailing slashes", () => {
      const result = removeTrailingSlashes("https://lukeb.co.uk");

      expect(result).toBe("https://lukeb.co.uk");
    });

    test("should return the same object if it is not a string", () => {
      const data = ["hi"];
      const result = removeTrailingSlashes(data);

      expect(result).toBe(data);
    });
  });

  describe("replaceAll", () => {
    test("should replace single instances", () => {
      const result = replaceAll(
        "hello, my name is Luke",
        "Luke",
        "CodeFoodPixels"
      );

      expect(result).toBe("hello, my name is CodeFoodPixels");
    });

    test("should replace multiple instances", () => {
      const result = replaceAll(
        "badger, badger, badger, badger, mushroom, mushroom",
        "mushroom",
        "snaaaake"
      );

      expect(result).toBe("badger, badger, badger, badger, snaaaake, snaaaake");
    });
  });
});
