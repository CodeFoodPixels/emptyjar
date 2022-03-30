const log = jest.spyOn(console, "log").mockImplementation(() => {});

describe("Config", () => {
  beforeEach(() => {
    jest.disableAutomock();
    jest.resetModules();
    log.mockReset();
  });

  test("Should return defaults when no config file found", () => {
    const config = require("../config");

    expect(log).toBeCalledWith("Invalid or missing config file, using defauts");

    expect(config).toEqual({
      allowedDomains: ["(.+)"],
      storageDriver: "sqlite",
      storageOptions: {
        location: ".data/hits.db"
      },
      port: 8080
    });
  });

  test("Should load config file and merge with defaults", () => {
    jest.mock(
      "../../config.json",
      () => {
        return {
          allowedDomains: ["lukeb.co.uk"],
          storageDriver: "fakedb",
          storageOptions: {
            testOption: "test"
          }
        };
      },
      { virtual: true }
    );

    const config = require("../config");

    expect(config).toEqual({
      allowedDomains: ["lukeb.co.uk"],
      storageDriver: "fakedb",
      storageOptions: {
        testOption: "test"
      },
      port: 8080
    });
  });

  test("Should return defaults when no invalid config file found", () => {
    jest.mock(
      "../../config.json",
      () => {
        return ["test", "test2"];
      },
      { virtual: true }
    );

    const config = require("../config");

    expect(log).toBeCalledWith("Invalid or missing config file, using defauts");

    expect(config).toEqual({
      allowedDomains: ["(.+)"],
      storageDriver: "sqlite",
      storageOptions: {
        location: ".data/hits.db"
      },
      port: 8080
    });
  });
});
