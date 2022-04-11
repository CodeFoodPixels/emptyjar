import { dateYMD, stateFromUrlParams, generateInitialState } from "../helpers";

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

  describe("generateInitialState", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2022-04-11 15:00:00 UTC"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return a state object", () => {
      delete window.location;
      window.location = new URL("https://lukeb.co.uk");

      const result = generateInitialState();

      expect(result).toEqual({
        queryDates: {
          from: new Date("2022-04-05 00:00:00.000 UTC"),
          to: new Date("2022-04-11 23:59:59.999 UTC")
        },
        filters: {},
        loading: false,
        data: []
      });
    });

    it("should return a state object with url parameters", () => {
      delete window.location;
      window.location = new URL(
        "https://lukeb.co.uk/?to=2022-04-01T23%3A59%3A59.999Z&from=2022-03-25T00%3A00%3A00.000Z&url=https%3A%2F%2Flukeb.co.uk&referrer=www.11ty.dev&device_type=desktop&operating_system=Windows 10&browser=Firefox 97.0&country=GB"
      );

      const result = generateInitialState();

      expect(result).toEqual({
        queryDates: {
          from: new Date("2022-03-25 00:00:00.000 UTC"),
          to: new Date("2022-04-01 23:59:59.999 UTC")
        },
        filters: {
          browser: "Firefox 97.0",
          country: "GB",
          device_type: "desktop",
          operating_system: "Windows 10",
          referrer: "www.11ty.dev",
          url: "https://lukeb.co.uk"
        },
        loading: false,
        data: []
      });
    });
  });
});
