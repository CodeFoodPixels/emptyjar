import { mapURLToName, mapNameToURLs } from "../referrerMap";

describe("referrerMap", () => {
  describe("mapURLToName", () => {
    it("should return a name for a url", () => {
      const result = mapURLToName("https://google.com");

      expect(result).toBe("Google");
    });

    it("should return the url if a name doesn't exist", () => {
      const result = mapURLToName("https://lukeb.co.uk");

      expect(result).toBe("https://lukeb.co.uk");
    });
  });

  describe("mapNameToURLs", () => {
    it("should return a list of urls", () => {
      const result = mapNameToURLs("Twitter");

      expect(result).toEqual(["twitter.com", "t.co"]);
    });

    it("should return the name if it doesn't exist in the list", () => {
      const result = mapNameToURLs("Potatoes");

      expect(result).toEqual("Potatoes");
    });
  });
});
