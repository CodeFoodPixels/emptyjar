import { updateFilters, removeFilter, clearFilters } from "../filters";

describe("filters", () => {
  describe("updateFilters", () => {
    it("should add new filters to the filter list", () => {
      const result = updateFilters(
        {
          test: true,
          filters: {
            url: "lukeb.co.uk"
          }
        },
        { key: "referrer", value: "google.com" }
      );

      expect(result).toEqual({
        test: true,
        filters: {
          url: "lukeb.co.uk",
          referrer: "google.com"
        }
      });
    });
    it("should update existing filters", () => {
      const result = updateFilters(
        {
          test: true,
          filters: {
            url: "lukeb.co.uk"
          }
        },
        { key: "url", value: "doineedbuntingtoday.com" }
      );

      expect(result).toEqual({
        test: true,
        filters: {
          url: "doineedbuntingtoday.com"
        }
      });
    });
  });

  describe("removeFilter", () => {
    it("should remove a given filter", () => {
      const result = removeFilter(
        {
          test: true,
          filters: {
            url: "lukeb.co.uk",
            referrer: "google.com"
          }
        },
        { key: "referrer" }
      );

      expect(result).toEqual({
        test: true,
        filters: {
          url: "lukeb.co.uk"
        }
      });
    });

    it("should do nothing if a filter doesn't exist", () => {
      const result = removeFilter(
        {
          test: true,
          filters: {
            url: "lukeb.co.uk"
          }
        },
        { key: "referrer" }
      );

      expect(result).toEqual({
        test: true,
        filters: {
          url: "lukeb.co.uk"
        }
      });
    });
  });

  describe("clearFilters", () => {
    it("should remove all filters", () => {
      const result = clearFilters({
        test: true,
        filters: {
          url: "lukeb.co.uk",
          referrer: "google.com"
        }
      });

      expect(result).toEqual({
        test: true,
        filters: {}
      });
    });
  });
});
