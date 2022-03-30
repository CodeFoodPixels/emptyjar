const fs = require("fs");
const path = require("path");
jest.useFakeTimers().setSystemTime(new Date("2022-03-03T02:00:00"));
const testData = require("./sqlite.testData");

jest.mock("sqlite3", () => {
  return {
    verbose: jest.fn(() => {
      return {
        Database: mockDatabase
      };
    })
  };
});

const mockRun = jest.fn(function() {
  arguments[arguments.length - 1]();
});

const mockAll = jest.fn();

const mockDatabase = jest.fn(() => {
  this.serialize = jest.fn(callback => {
    callback();
  });
  this.run = mockRun;
  this.all = mockAll;
  return this;
});

const sqliteDriver = require("../sqlite");

const existsSync = jest.spyOn(fs, "existsSync").mockReturnValue(true);

function createInstance() {
  return new sqliteDriver({
    location: ".data/hits.db"
  });
}

describe("sqlite storage driver", () => {
  beforeEach(() => {
    mockRun.mockClear();
    mockAll.mockClear();
  });

  describe("init", () => {
    test("should set up the db if it doesn't exist", async () => {
      existsSync.mockReturnValueOnce(false);
      const instance = createInstance();
      await expect(instance.init()).resolves.toBe();
      expect(mockDatabase).toHaveBeenCalledWith(
        path.join(__dirname, "..", "..", "..", ".data", "hits.db")
      );
      expect(mockRun).toHaveBeenCalledTimes(3);
    });

    test("should not set up the db if it already exists", async () => {
      existsSync.mockReturnValueOnce(true);
      const instance = createInstance();
      await expect(instance.init()).resolves.toBe();
      expect(mockDatabase).toHaveBeenCalledWith(
        path.join(__dirname, "..", "..", "..", ".data", "hits.db")
      );
      expect(mockRun).toHaveBeenCalledTimes(0);
    });
  });

  describe("insertOne", () => {
    const instance = createInstance();
    beforeAll(async () => {
      await instance.init();
    });

    test("should insert string column into db", () => {
      expect(
        instance.insertOne("test_table", { test_column: "hello" })
      ).resolves.toBe();
      expect(mockRun.mock.lastCall[0]).toBe(
        "INSERT INTO test_table (test_column) VALUES ($test_column)"
      );
      expect(mockRun.mock.lastCall[1]).toEqual({ $test_column: "hello" });
    });

    test("should insert multiple string columns into db", () => {
      expect(
        instance.insertOne("test_table", {
          test_column: "hello",
          test_column2: "goodbye"
        })
      ).resolves.toBe();
      expect(mockRun.mock.lastCall[0]).toBe(
        "INSERT INTO test_table (test_column, test_column2) VALUES ($test_column, $test_column2)"
      );
      expect(mockRun.mock.lastCall[1]).toEqual({
        $test_column: "hello",
        $test_column2: "goodbye"
      });
    });

    test("should convert and insert boolean columns into db", () => {
      expect(
        instance.insertOne("test_table", {
          test_true_bool: true,
          test_false_bool: false
        })
      ).resolves.toBe();
      expect(mockRun.mock.lastCall[0]).toBe(
        "INSERT INTO test_table (test_true_bool, test_false_bool) VALUES ($test_true_bool, $test_false_bool)"
      );
      expect(mockRun.mock.lastCall[1]).toEqual({
        $test_true_bool: 1,
        $test_false_bool: 0
      });
    });

    test("should convert and insert date column into db", () => {
      const date = new Date();
      expect(
        instance.insertOne("test_table", {
          test_date: date
        })
      ).resolves.toBe();
      expect(mockRun.mock.lastCall[0]).toBe(
        "INSERT INTO test_table (test_date) VALUES ($test_date)"
      );
      expect(mockRun.mock.lastCall[1]).toEqual({
        $test_date: 1646272800
      });
    });
  });

  describe("find", () => {
    const instance = createInstance();
    beforeAll(async () => {
      await instance.init();
    });

    test.each(testData)(
      "$name",
      async ({ parameters, returnData, rows, query, queryParams }) => {
        mockAll.mockImplementationOnce(function() {
          arguments[arguments.length - 1](null, returnData);
        });

        await expect(instance.find("test_table", parameters)).resolves.toEqual(
          rows
        );
        expect(mockAll.mock.lastCall[0]).toBe(query);
        expect(mockAll.mock.lastCall[1]).toEqual(queryParams);
      }
    );

    test("rejects if there is an error", async () => {
      mockAll.mockImplementationOnce(function() {
        arguments[arguments.length - 1](new Error("Whoops"));
      });

      await expect(instance.find("test_table")).rejects.toThrow("Whoops");
    });
  });
});
