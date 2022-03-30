const storage = require("../storage");
const data = require("../data");

jest.mock("../storage", () => ({
  insertOne: jest.fn(),
  find: jest.fn()
}));
jest.useFakeTimers().setSystemTime(new Date("2022-03-03T02:00:00"));

describe("Data", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("logHit should insert item into storage", () => {
    data.logHit({
      url: "https://lukeb.co.uk",
      referrer: "google.com"
    });

    expect(storage.insertOne.mock.lastCall[0]).toBe("hits");
    expect(storage.insertOne.mock.lastCall[1]).toEqual({
      url: "https://lukeb.co.uk",
      referrer: "google.com",
      timestamp: new Date()
    });
  });

  test("logPageHitSignature should insert item into storage", () => {
    data.logPageHitSignature("test logPageHitSignature");

    expect(storage.insertOne.mock.lastCall[0]).toBe("page_hit_signatures");
    expect(storage.insertOne.mock.lastCall[1]).toEqual({
      signature: "test logPageHitSignature"
    });
  });

  test("logSiteHitSignature should insert item into storage", () => {
    data.logSiteHitSignature("test logSiteHitSignature");

    expect(storage.insertOne.mock.lastCall[0]).toBe("site_hit_signatures");
    expect(storage.insertOne.mock.lastCall[1]).toEqual({
      signature: "test logSiteHitSignature"
    });
  });

  test("pageHitUnique should return false if signature in storage", async () => {
    storage.find.mockResolvedValueOnce(["test"]);
    const result = await data.pageHitUnique("test");

    expect(storage.find.mock.lastCall[0]).toBe("page_hit_signatures");
    expect(storage.find.mock.lastCall[1]).toEqual([
      { key: "signature", value: "test" }
    ]);
    expect(result).toBe(false);
  });

  test("pageHitUnique should return true if signature not in storage", async () => {
    storage.find.mockResolvedValueOnce([]);
    const result = await data.pageHitUnique("test");

    expect(storage.find.mock.lastCall[0]).toBe("page_hit_signatures");
    expect(storage.find.mock.lastCall[1]).toEqual([
      { key: "signature", value: "test" }
    ]);
    expect(result).toBe(true);
  });

  test("siteHitUnique should return false if signature in storage", async () => {
    storage.find.mockResolvedValueOnce(["test"]);
    const result = await data.siteHitUnique("test");

    expect(storage.find.mock.lastCall[0]).toBe("site_hit_signatures");
    expect(storage.find.mock.lastCall[1]).toEqual([
      { key: "signature", value: "test" }
    ]);
    expect(result).toBe(false);
  });

  test("siteHitUnique should return true if signature not in storage", async () => {
    storage.find.mockResolvedValueOnce([]);
    const result = await data.siteHitUnique("test");

    expect(storage.find.mock.lastCall[0]).toBe("site_hit_signatures");
    expect(storage.find.mock.lastCall[1]).toEqual([
      { key: "signature", value: "test" }
    ]);
    expect(result).toBe(true);
  });

  test("getHits should return hits from storage", async () => {
    storage.find.mockResolvedValueOnce(["test"]);
    const result = await data.getHits();

    expect(storage.find.mock.lastCall[0]).toBe("hits");
    expect(storage.find.mock.lastCall[1]).toEqual([]);
    expect(result).toEqual(["test"]);
  });

  test.each([
    {
      key: "url",
      value: "https://lukeb.co.uk",
      expected: {
        key: "url",
        value: "https://lukeb.co.uk"
      }
    },
    {
      key: "referrer",
      value: "google.com",
      expected: {
        key: "referrer",
        value: ["*.google.com", "google.com"],
        wildcardCharacter: "*",
        wildcardMatch: true
      }
    },
    {
      key: "referrer",
      value: ["google.com", "bing.com"],
      expected: {
        key: "referrer",
        value: ["*.google.com", "google.com", "*.bing.com", "bing.com"],
        wildcardCharacter: "*",
        wildcardMatch: true
      }
    },
    {
      key: "operating_system",
      value: "Windows 10",
      expected: {
        key: "operating_system",
        value: "Windows 10"
      }
    },
    {
      key: "browser",
      value: "Firefox 97.0",
      expected: {
        key: "browser",
        value: "Firefox 97.0"
      }
    },
    {
      key: "device_type",
      value: "mobile",
      expected: {
        key: "device_type",
        value: "mobile"
      }
    },
    {
      key: "country",
      value: "GB",
      expected: {
        key: "country",
        value: "GB"
      }
    },
    {
      key: "page_hit_unique",
      value: true,
      expected: {
        key: "page_hit_unique",
        strictEquality: true,
        value: true
      }
    },
    {
      key: "site_hit_unique",
      value: true,
      expected: {
        key: "site_hit_unique",
        strictEquality: true,
        value: true
      }
    },
    {
      key: "from",
      value: "2021-01-01",
      expected: {
        key: "timestamp",
        operator: ">=",
        value: new Date("2021-01-01T00:00:00.000Z")
      }
    },
    {
      key: "to",
      value: "2022-01-01",
      expected: {
        key: "timestamp",
        operator: "<=",
        value: new Date("2022-01-01T00:00:00.000Z")
      }
    }
  ])(
    "getHits with $key specified should return hits from storage",
    async ({ key, value, expected }) => {
      storage.find.mockResolvedValueOnce(["test"]);
      const result = await data.getHits({ [key]: value });

      expect(storage.find.mock.lastCall[0]).toBe("hits");
      expect(storage.find.mock.lastCall[1]).toEqual([expected]);
      expect(result).toEqual(["test"]);
    }
  );
});
