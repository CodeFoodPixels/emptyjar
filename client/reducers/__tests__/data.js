import reducer from "../data";
import testData from "./data.testData";

describe("data reducer", () => {
  it("should restructure data", () => {
    const result = reducer(
      {
        queryDates: {
          to: new Date("2022-04-01T23:59:59.000Z"),
          from: new Date("2022-03-27T00:00:00.000Z")
        },
        filters: {}
      },
      { data: testData }
    );

    expect(result).toEqual({
      queryDates: {
        to: new Date("2022-04-01T23:59:59.000Z"),
        from: new Date("2022-03-27T00:00:00.000Z")
      },
      filters: {},
      loading: false,
      data: {
        dates: [
          "2022-03-27",
          "2022-03-28",
          "2022-03-29",
          "2022-03-30",
          "2022-03-31",
          "2022-04-01"
        ],
        views: {
          "2022-03-27": 3,
          "2022-03-28": 5,
          "2022-03-29": 2,
          "2022-03-30": 0,
          "2022-03-31": 3,
          "2022-04-01": 1
        },
        uniques: {
          "2022-03-27": 0,
          "2022-03-28": 0,
          "2022-03-29": 0,
          "2022-03-30": 0,
          "2022-03-31": 1,
          "2022-04-01": 0
        },
        countries: {
          "United States": {
            Uniques: 1
          },
          Sweden: {
            Uniques: 0
          },
          Indonesia: {
            Uniques: 0
          },
          Germany: {
            Uniques: 0
          }
        },
        devices: {
          desktop: {
            Uniques: 1
          }
        },
        browsers: {
          "Chrome 91.0.4472.114": {
            Uniques: 0
          },
          "Chrome 99.0.4844.84": {
            Uniques: 0
          },
          "Chrome 99.0.4844.83": {
            Uniques: 0
          },
          "Chrome 99.0.4844.82": {
            Uniques: 0
          },
          "Firefox 99.0": {
            Uniques: 0
          },
          "Chrome 98.0.4758.80": {
            Uniques: 1
          },
          "Chrome 100.0.4896.60": {
            Uniques: 0
          }
        },
        operatingSystems: {
          "macOS 10.15.7": {
            Uniques: 0
          },
          "Windows 10": {
            Uniques: 0
          },
          Linux: {
            Uniques: 1
          }
        },
        urls: {
          "https://lukeb.co.uk/": {
            "Total Views": 14,
            "Unique Views": 10
          }
        },
        referrers: {
          "lukeb.co.uk": {
            "Total Views": 11
          }
        },
        totalHits: 14,
        totalReferredHits: 11,
        totalPageUniques: 10,
        totalUniques: 1
      }
    });
  });

  it("should convert undefined country code to Unknown", () => {
    const result = reducer(
      {
        queryDates: {
          to: new Date("2022-03-27T23:59:59.000Z"),
          from: new Date("2022-03-27T00:00:00.000Z")
        },
        filters: {}
      },
      {
        data: [
          {
            url: "https://lukeb.co.uk/",
            browser: "Chrome 91.0.4472.114",
            browser_version: null,
            operating_system: "macOS 10.15.7",
            operating_system_version: null,
            device_type: "desktop",
            country: "LOL",
            page_hit_unique: true,
            site_hit_unique: false,
            timestamp: "2022-03-27T12:39:30.000Z",
            referrer: ""
          }
        ]
      }
    );

    expect(result).toEqual({
      data: {
        browsers: {
          "Chrome 91.0.4472.114": {
            Uniques: 0
          }
        },
        countries: {
          Unknown: {
            Uniques: 0
          }
        },
        dates: ["2022-03-27"],
        devices: {
          desktop: {
            Uniques: 0
          }
        },
        operatingSystems: {
          "macOS 10.15.7": {
            Uniques: 0
          }
        },
        referrers: {},
        totalHits: 1,
        totalPageUniques: 1,
        totalReferredHits: 0,
        totalUniques: 0,
        uniques: {
          "2022-03-27": 0
        },
        urls: {
          "https://lukeb.co.uk/": {
            "Total Views": 1,
            "Unique Views": 1
          }
        },
        views: {
          "2022-03-27": 1
        }
      },
      filters: {},
      loading: false,
      queryDates: {
        from: new Date("2022-03-27T00:00:00.000Z"),
        to: new Date("2022-03-27T23:59:59.000Z")
      }
    });
  });

  it("should mark page uniques as uniques when filtered by url", () => {
    const result = reducer(
      {
        queryDates: {
          to: new Date("2022-03-27T23:59:59.000Z"),
          from: new Date("2022-03-27T00:00:00.000Z")
        },
        filters: {
          url: ["lukeb.co.uk"]
        }
      },
      {
        data: [
          {
            url: "https://lukeb.co.uk/",
            browser: "Chrome 91.0.4472.114",
            browser_version: null,
            operating_system: "macOS 10.15.7",
            operating_system_version: null,
            device_type: "desktop",
            country: "US",
            page_hit_unique: true,
            site_hit_unique: false,
            timestamp: "2022-03-27T12:39:30.000Z",
            referrer: ""
          }
        ]
      }
    );

    expect(result).toEqual({
      data: {
        browsers: {
          "Chrome 91.0.4472.114": {
            Uniques: 1
          }
        },
        countries: {
          "United States": {
            Uniques: 1
          }
        },
        dates: ["2022-03-27"],
        devices: {
          desktop: {
            Uniques: 1
          }
        },
        operatingSystems: {
          "macOS 10.15.7": {
            Uniques: 1
          }
        },
        referrers: {},
        totalHits: 1,
        totalPageUniques: 1,
        totalReferredHits: 0,
        totalUniques: 1,
        uniques: {
          "2022-03-27": 1
        },
        urls: {
          "https://lukeb.co.uk/": {
            "Total Views": 1,
            "Unique Views": 1
          }
        },
        views: {
          "2022-03-27": 1
        }
      },
      filters: { url: ["lukeb.co.uk"] },
      loading: false,
      queryDates: {
        from: new Date("2022-03-27T00:00:00.000Z"),
        to: new Date("2022-03-27T23:59:59.000Z")
      }
    });
  });

  it("should mark page uniques as uniques when filtered by referrer", () => {
    const result = reducer(
      {
        queryDates: {
          to: new Date("2022-03-27T23:59:59.000Z"),
          from: new Date("2022-03-27T00:00:00.000Z")
        },
        filters: {
          referrer: ["lukeb.co.uk"]
        }
      },
      {
        data: [
          {
            url: "https://lukeb.co.uk/",
            browser: "Chrome 91.0.4472.114",
            browser_version: null,
            operating_system: "macOS 10.15.7",
            operating_system_version: null,
            device_type: "desktop",
            country: "US",
            page_hit_unique: true,
            site_hit_unique: false,
            timestamp: "2022-03-27T12:39:30.000Z",
            referrer: "lukeb.co.uk"
          }
        ]
      }
    );

    expect(result).toEqual({
      data: {
        browsers: {
          "Chrome 91.0.4472.114": {
            Uniques: 1
          }
        },
        countries: {
          "United States": {
            Uniques: 1
          }
        },
        dates: ["2022-03-27"],
        devices: {
          desktop: {
            Uniques: 1
          }
        },
        operatingSystems: {
          "macOS 10.15.7": {
            Uniques: 1
          }
        },
        referrers: {
          "lukeb.co.uk": {
            "Total Views": 1
          }
        },
        totalHits: 1,
        totalPageUniques: 1,
        totalReferredHits: 1,
        totalUniques: 1,
        uniques: {
          "2022-03-27": 1
        },
        urls: {
          "https://lukeb.co.uk/": {
            "Total Views": 1,
            "Unique Views": 1
          }
        },
        views: {
          "2022-03-27": 1
        }
      },
      filters: { referrer: ["lukeb.co.uk"] },
      loading: false,
      queryDates: {
        from: new Date("2022-03-27T00:00:00.000Z"),
        to: new Date("2022-03-27T23:59:59.000Z")
      }
    });
  });
});
