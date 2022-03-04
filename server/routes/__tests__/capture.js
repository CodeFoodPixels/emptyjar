const data = require("../../data.js");
const urlChecker = require("../../utilities/urlChecker");
const capture = require("../capture");
const path = require("path");

jest.mock("../../data.js");
jest.mock("../../utilities/urlChecker");
jest.useFakeTimers().setSystemTime(new Date("2022-03-03T02:00:00"));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("capture routes", () => {
  describe("ping endpoint", () => {
    test("should return image and log hit", async () => {
      const urlData = {
        url: "https://lukeb.co.uk",
        r: ""
      };
      const req = {
        requestUrl: new URL(
          `https://analytics.lukeb.co.uk/ping?data=${encodeURIComponent(
            JSON.stringify(urlData)
          )}`
        ),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { sendFile: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.ping(req, res);

      expect(res.sendFile.mock.lastCall[0]).toBe(
        path.join("..", "public", "img", "ping.png")
      );

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "Windows 10"
      });
    });

    test("should return image and log hit with a referrer", async () => {
      const urlData = {
        url: "https://lukeb.co.uk",
        r: "https://google.com"
      };
      const req = {
        requestUrl: new URL(
          `https://analytics.lukeb.co.uk/ping?data=${encodeURIComponent(
            JSON.stringify(urlData)
          )}`
        ),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { sendFile: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.ping(req, res);

      expect(res.sendFile.mock.lastCall[0]).toBe(
        path.join("..", "public", "img", "ping.png")
      );

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "google.com",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "macOS 10.15"
      });
    });

    test("should return image and log hit with an android app referrer", async () => {
      const urlData = {
        url: "https://lukeb.co.uk",
        r: "android-app://com.linkedin.android"
      };
      const req = {
        requestUrl: new URL(
          `https://analytics.lukeb.co.uk/ping?data=${encodeURIComponent(
            JSON.stringify(urlData)
          )}`
        ),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { sendFile: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.ping(req, res);

      expect(res.sendFile.mock.lastCall[0]).toBe(
        path.join("..", "public", "img", "ping.png")
      );

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "android-app://com.linkedin.android",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "macOS 10.15"
      });
    });

    test("should return image and log hit without a referrer when referrer is invalid", async () => {
      const urlData = {
        url: "https://lukeb.co.uk",
        r: "fake://google.com"
      };
      const req = {
        requestUrl: new URL(
          `https://analytics.lukeb.co.uk/ping?data=${encodeURIComponent(
            JSON.stringify(urlData)
          )}`
        ),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { sendFile: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.ping(req, res);

      expect(res.sendFile.mock.lastCall[0]).toBe(
        path.join("..", "public", "img", "ping.png")
      );

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "macOS 10.15"
      });
    });

    test("should return image and log hit with Unknown if country cannot be determined", async () => {
      const urlData = {
        url: "https://lukeb.co.uk",
        r: ""
      };
      const req = {
        requestUrl: new URL(
          `https://analytics.lukeb.co.uk/ping?data=${encodeURIComponent(
            JSON.stringify(urlData)
          )}`
        ),
        connection: {
          socket: {
            remoteAddress: "192.168.0.1"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { sendFile: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.ping(req, res);

      expect(res.sendFile.mock.lastCall[0]).toBe(
        path.join("..", "public", "img", "ping.png")
      );

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "Unknown",
        referrer: "",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "macOS 10.15"
      });
    });

    test("should return image and log hit as unique", async () => {
      const urlData = {
        url: "https://lukeb.co.uk",
        r: ""
      };
      const req = {
        requestUrl: new URL(
          `https://analytics.lukeb.co.uk/ping?data=${encodeURIComponent(
            JSON.stringify(urlData)
          )}`
        ),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { sendFile: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(true);
      data.siteHitUnique.mockResolvedValueOnce(true);

      urlChecker.mockReturnValueOnce(true);

      await capture.ping(req, res);

      expect(res.sendFile.mock.lastCall[0]).toBe(
        path.join("..", "public", "img", "ping.png")
      );

      expect(data.logPageHitSignature.mock.lastCall[0]).toBe(
        "cdb665ef399020e74a485d2a4d3130be3eb6f08600d674cd6fee39f3de65aa15"
      );

      expect(data.logSiteHitSignature.mock.lastCall[0]).toBe(
        "746b53516d143a0e8b019e8968aa892189fb5b34209d531225a466178ee928f2"
      );

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: true,
        site_hit_unique: true,
        browser: "Firefox 97.0",
        operating_system: "Windows 10"
      });
    });

    test("should return image and not log hit if URL is invalid", async () => {
      const urlData = {
        url: "https://wrongdomain.com",
        r: ""
      };
      const req = {
        requestUrl: new URL(
          `https://analytics.lukeb.co.uk/ping?data=${encodeURIComponent(
            JSON.stringify(urlData)
          )}`
        ),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { sendFile: jest.fn() };

      urlChecker.mockReturnValueOnce(false);

      await capture.ping(req, res);

      expect(res.sendFile.mock.lastCall[0]).toBe(
        path.join("..", "public", "img", "ping.png")
      );

      expect(data.logHit).not.toHaveBeenCalled();
    });

    test("should return image and not log hit if data is invalid", async () => {
      const req = {
        requestUrl: new URL(
          `https://analytics.lukeb.co.uk/ping?data=${encodeURIComponent(
            '{"test":"yeah"'
          )}`
        ),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { sendFile: jest.fn() };

      urlChecker.mockReturnValueOnce(false);

      await capture.ping(req, res);

      expect(res.sendFile.mock.lastCall[0]).toBe(
        path.join("..", "public", "img", "ping.png")
      );

      expect(data.logHit).not.toHaveBeenCalled();
    });
  });

  describe("beacon endpoint", () => {
    test("should log hit", async () => {
      const hitData = {
        url: "https://lukeb.co.uk",
        r: ""
      };
      const req = {
        requestUrl: new URL("https://analytics.lukeb.co.uk/beacon"),
        body: JSON.stringify(hitData),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { end: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.beacon(req, res);

      expect(res.end).toHaveBeenCalled();

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "macOS 10.15"
      });
    });

    test("should log hit with referrer", async () => {
      const hitData = {
        url: "https://lukeb.co.uk",
        r: "https://google.com"
      };
      const req = {
        requestUrl: new URL("https://analytics.lukeb.co.uk/beacon"),
        body: JSON.stringify(hitData),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { end: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.beacon(req, res);

      expect(res.end).toHaveBeenCalled();

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "google.com",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "macOS 10.15"
      });
    });

    test("should log hit with an android app referrer", async () => {
      const hitData = {
        url: "https://lukeb.co.uk",
        r: "android-app://com.linkedin.android"
      };
      const req = {
        rrequestUrl: new URL("https://analytics.lukeb.co.uk/beacon"),
        body: JSON.stringify(hitData),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { end: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.beacon(req, res);

      expect(res.end).toHaveBeenCalled();

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "android-app://com.linkedin.android",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "macOS 10.15"
      });
    });

    test("should log hit without a referrer when referrer is invalid", async () => {
      const hitData = {
        url: "https://lukeb.co.uk",
        r: "fake://google.com"
      };
      const req = {
        requestUrl: new URL("https://analytics.lukeb.co.uk/beacon"),
        body: JSON.stringify(hitData),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { end: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.beacon(req, res);

      expect(res.end).toHaveBeenCalled();

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "macOS 10.15"
      });
    });

    test("should log hit with Unknown if country cannot be determined", async () => {
      const hitData = {
        url: "https://lukeb.co.uk",
        r: "https://google.com"
      };
      const req = {
        requestUrl: new URL("https://analytics.lukeb.co.uk/beacon"),
        body: JSON.stringify(hitData),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { end: jest.fn() };

      data.pageHitUnique.mockResolvedValueOnce(false);
      data.siteHitUnique.mockResolvedValueOnce(false);

      urlChecker.mockReturnValueOnce(true);

      await capture.beacon(req, res);

      expect(res.end).toHaveBeenCalled();

      expect(data.logHit.mock.lastCall[0]).toEqual({
        country: "US",
        referrer: "google.com",
        device_type: "desktop",
        url: "https://lukeb.co.uk",
        page_hit_unique: false,
        site_hit_unique: false,
        browser: "Firefox 97.0",
        operating_system: "macOS 10.15"
      });
    });

    test("should not log hit if URL is invalid", async () => {
      const hitData = {
        url: "https://wrongdomain.com",
        r: ""
      };
      const req = {
        requestUrl: new URL("https://analytics.lukeb.co.uk/beacon"),
        body: JSON.stringify(hitData),
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { end: jest.fn() };

      urlChecker.mockReturnValueOnce(false);

      await capture.beacon(req, res);

      expect(res.end).toHaveBeenCalled();

      expect(data.logHit).not.toHaveBeenCalled();
    });

    test("should not log hit if body is invalid", async () => {
      const req = {
        requestUrl: new URL("https://analytics.lukeb.co.uk/beacon"),
        body: '{"test":"yeah"',
        connection: {
          socket: {
            remoteAddress: "8.8.8.8"
          }
        },
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0"
        }
      };
      const res = { end: jest.fn() };

      urlChecker.mockReturnValueOnce(false);

      await capture.beacon(req, res);

      expect(res.end).toHaveBeenCalled();

      expect(data.logHit).not.toHaveBeenCalled();
    });
  });
});
