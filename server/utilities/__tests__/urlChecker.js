const urlChecker = require("../urlChecker");
const config = require("../../config");

jest.mock("../../config");

describe("URL Checker", () => {
  beforeEach(() => {
    config.allowedDomains = [];
  });

  test("returns true if url is in the allowed list", () => {
    config.allowedDomains = ["lukeb.co.uk", "(.+?).lukeb.co.uk"];

    const result = urlChecker("https://lukeb.co.uk");
    expect(result).toBe(true);
  });

  test("returns true if url is in the allowed list and the url list is a single url", () => {
    config.allowedDomains = ["lukeb.co.uk"];

    const result = urlChecker("https://lukeb.co.uk");
    expect(result).toBe(true);
  });

  test("returns false if url is not in the allowed list", () => {
    config.allowedDomains = ["lukeb.co.uk", "(.+?).lukeb.co.uk"];

    const result = urlChecker("https://google.com");
    expect(result).toBe(false);
  });
});
