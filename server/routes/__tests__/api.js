const data = require("../../data.js");
const api = require("../api");

jest.mock("../../data.js");

describe("api routes", () => {
  test("hits endpoint should return 200", async () => {
    const rows = [
      {
        url: "https://lukeb.co.uk",
        browser: "Firefox 97.0",
        browser_version: null,
        operating_system: "Windows 10",
        operating_system_version: null,
        device_type: "desktop",
        country: "BG",
        page_hit_unique: true,
        site_hit_unique: true,
        timestamp: "2022-02-25T14:07:39.000Z",
        referrer: "www.11ty.dev"
      },
      {
        url: "https://lukeb.co.uk",
        browser: "Chrome 98.0.4758.102",
        browser_version: null,
        operating_system: "macOS 10.15.7",
        operating_system_version: null,
        device_type: "desktop",
        country: "GB",
        page_hit_unique: true,
        site_hit_unique: true,
        timestamp: "2022-02-25T15:10:44.000Z",
        referrer: "t.co"
      },
      {
        url: "https://lukeb.co.uk",
        browser: "Chrome 98.0.4758.109",
        browser_version: null,
        operating_system: "macOS 10.15.7",
        operating_system_version: null,
        device_type: "desktop",
        country: "GB",
        page_hit_unique: true,
        site_hit_unique: true,
        timestamp: "2022-02-25T15:45:09.000Z",
        referrer: ""
      }
    ];
    data.getHits.mockResolvedValue(rows);
    const req = {
      requestUrl: new URL("https://analytics.lukeb.co.uk/api/hits")
    };

    const res = { sendJSON: jest.fn() };
    await api.hits(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.sendJSON.mock.lastCall[0]).toEqual(rows);
  });

  test("hits endpoint should return 404 when no data is returned", async () => {
    const rows = [];
    data.getHits.mockResolvedValue(rows);
    const req = {
      requestUrl: new URL(
        "https://analytics.lukeb.co.uk/api/hits?url=test&referrer=test&operating_system=test&browser=test&device_type=test&country=test&page_hit_unique=false&site_hit_unique=false&from=test&to=test"
      )
    };
    const res = { sendJSON: jest.fn() };
    await api.hits(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.sendJSON.mock.lastCall[0]).toEqual(rows);
  });

  test("teapot endpoint should return 418", () => {
    const res = { sendJSON: jest.fn() };
    api.teapot({}, res);

    expect(res.statusCode).toBe(418);
    expect(res.sendJSON.mock.lastCall[0]).toEqual({
      message: "I'm a little teapot..."
    });
  });
});
