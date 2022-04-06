import {
  getCountryCode,
  getCountryName,
  dateYMD,
  stateFromUrlParams
} from "../helpers";

describe("helpers", () => {
  describe("dateYMD", () => {
    it("should pad single digits with a zero", () => {
      const result = dateYMD(new Date("January 1 2022"));

      expect(result).toBe("2022-01-01");
    });

    it("should not pad double digits with a zero", () => {
      const result = dateYMD(new Date("December 25 2022"));

      expect(result).toBe("2022-12-25");
    });
  });

  describe("stateFromUrlParams", () => {
    it("should return a state object from URL", () => {
      const result = stateFromUrlParams(
        "https://lukeb.co.uk/?url=lukeb.co.uk&referrer=google.com"
      );

      expect(result).toEqual({
        queryDates: {},
        filters: {
          url: "lukeb.co.uk",
          referrer: "google.com"
        }
      });
    });

    it("should convert to and from to date objects", () => {
      const result = stateFromUrlParams(
        "https://lukeb.co.uk/?to=2022-01-07T23%3A59%3A59.999Z&from=2022-01-01T00%3A00%3A00.000Z"
      );

      expect(result).toEqual({
        queryDates: {
          to: new Date("2022-01-07T23:59:59.999Z"),
          from: new Date("2022-01-01T00:00:00.000Z")
        },
        filters: {}
      });
    });
  });
});
