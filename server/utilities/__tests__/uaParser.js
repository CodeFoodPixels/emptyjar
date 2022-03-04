const uaParser = require("../uaParser");

describe("UA Parser", () => {
  test("should return Unknown device type if cannot be determined", async () => {
    const uaData = uaParser(
      "Mozilla/5.0 (X11; CrOS armv7l 14388.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.107 Safari/537.36"
    );

    expect(uaData).toEqual({
      device_type: "Unknown",
      browser: "Chrome 98.0.4758.107",
      operating_system: "Chrome OS"
    });
  });

  test("should return Unknown browser if cannot be determined", async () => {
    const uaData = uaParser("(Macintosh; Intel Mac OS X 10.15; rv:97.0)");

    expect(uaData).toEqual({
      device_type: "desktop",
      browser: "Unknown",
      operating_system: "macOS 10.15"
    });
  });

  test("should returnout browser version if cannot be determined", async () => {
    const uaData = uaParser(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox"
    );

    expect(uaData).toEqual({
      device_type: "desktop",
      browser: "Firefox",
      operating_system: "macOS 10.15"
    });
  });

  test("should return unknown OS if cannot be determined", async () => {
    const uaData = uaParser("Mozilla/5.0 Gecko/20100101 Firefox/97.0");

    expect(uaData).toEqual({
      device_type: "Unknown",
      browser: "Firefox 97.0",
      operating_system: "Unknown"
    });
  });
});
