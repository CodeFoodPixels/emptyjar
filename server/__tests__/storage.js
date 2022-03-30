const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
  throw new Error();
});
const mockError = jest.spyOn(console, "error").mockImplementation(() => {});

describe("Storage", () => {
  beforeEach(() => {
    jest.disableAutomock();
    jest.resetModules();
    mockExit.mockClear();
    mockError.mockClear();
  });

  test("loads and initialises driver", async () => {
    require("../config");

    jest.mock("../config", () => {
      return {
        storageDriver: "fakedriver",
        storageOptions: {
          test: true
        }
      };
    });

    jest.mock(
      "../storageDrivers/fakedriver",
      () => {
        return jest.fn().mockImplementation(function fakedriver() {
          this.init = jest.fn();
          return this;
        });
      },
      { virtual: true }
    );

    const fakedriver = require("../storageDrivers/fakedriver");

    const storage = await require("../storage");

    expect(fakedriver).toBeCalledWith({ test: true });
    expect(storage).toBeInstanceOf(fakedriver);
  });

  test("throws an error and exits the process if driver couldn't be loaded", async () => {
    require("../config");

    jest.mock("../config", () => {
      return {
        storageDriver: "missingdriver",
        storageOptions: {
          test: true
        }
      };
    });

    try {
      await require("../storage");
    } catch (e) {}

    expect(mockError).toBeCalledWith(
      "Storage driver missingdriver could not be loaded"
    );
    expect(mockExit).toHaveBeenCalled();
  });

  test("throws an error and exits the process if driver couldn't be initialised", async () => {
    require("../config");

    jest.mock("../config", () => {
      return {
        storageDriver: "errordriver",
        storageOptions: {
          test: true
        }
      };
    });

    jest.mock(
      "../storageDrivers/errordriver",
      () => {
        return jest.fn().mockImplementation(function errordriver() {
          this.init = jest.fn();
          throw new Error();
          return this;
        });
      },
      { virtual: true }
    );

    const errordriver = require("../storageDrivers/errordriver");

    try {
      await require("../storage");
    } catch (e) {}
    expect(errordriver).toBeCalledWith({ test: true });
    expect(mockError).toBeCalledWith(
      "Storage driver errordriver could not be initialised"
    );
    expect(mockExit).toHaveBeenCalled();
  });
});
