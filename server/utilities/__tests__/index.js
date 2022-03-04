const utilities = require("../index");

describe("utilities", () => {
  describe("removeTrailingSlashes", () => {
    test("should strip a single trailing slash from a string", () => {
      const result = utilities.removeTrailingSlashes("https://lukeb.co.uk/");

      expect(result).toBe("https://lukeb.co.uk");
    });

    test("should strip multiple trailing slashes from a string", () => {
      const result = utilities.removeTrailingSlashes(
        "https://lukeb.co.uk/////"
      );

      expect(result).toBe("https://lukeb.co.uk");
    });

    test("should return the same string if there are no trailing slashes", () => {
      const result = utilities.removeTrailingSlashes("https://lukeb.co.uk");

      expect(result).toBe("https://lukeb.co.uk");
    });

    test("should return the same object if it is not a string", () => {
      const data = ["hi"];
      const result = utilities.removeTrailingSlashes(data);

      expect(result).toBe(data);
    });
  });
});
