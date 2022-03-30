jest.useFakeTimers().setSystemTime(new Date("2022-03-03T02:00:00"));
const testData = require("./mongodb.testData");

const mockConnect = jest.fn(() => Promise.resolve(mockClient));

const mockClient = {
  db: jest.fn(() => mockDb)
};

const mockDb = {
  collection: jest.fn(() => mockCollection)
};

const mockCollection = {
  find: jest.fn(),
  insertOne: jest.fn(() => {
    return Promise.resolve();
  })
};

function createMockResults(results) {
  return {
    toArray: jest.fn(() => {
      return Promise.resolve(results);
    })
  };
}

jest.mock("mongodb", () => {
  return {
    MongoClient: {
      connect: mockConnect
    }
  };
});

const mongoDriver = require("../mongodb");
function createInstance(options) {
  return new mongoDriver({
    url: "mongodb://localhost:27017",
    db: "emptyjar",
    ...options
  });
}

describe("mongodb storage driver", () => {
  beforeEach(() => {
    mockConnect.mockClear();
    mockClient.db.mockClear();
    mockDb.collection.mockClear();
    mockCollection.find.mockClear();
  });

  describe("init", () => {
    test("should connect to the db", async () => {
      const instance = createInstance();
      await expect(instance.init()).resolves.toBe();
      expect(mockConnect).toHaveBeenCalledWith(
        "mongodb://localhost:27017",
        undefined
      );
      expect(mockClient.db).toHaveBeenCalledWith("emptyjar");
    });

    test("should connect to the db with auth details", async () => {
      const instance = createInstance({
        username: "testuser",
        password: "testpassword"
      });
      await expect(instance.init()).resolves.toBe();
      expect(mockConnect).toHaveBeenCalledWith("mongodb://localhost:27017", {
        auth: { password: "testpassword", username: "testuser" }
      });
      expect(mockClient.db).toHaveBeenCalledWith("emptyjar");
    });
  });

  describe("insertOne", () => {
    test("should insert string column into db", async () => {
      const instance = createInstance();
      await instance.init();

      expect(
        instance.insertOne("test_table", { test_column: "hello" })
      ).resolves.toBe();

      expect(mockDb.collection.mock.lastCall[0]).toBe("test_table");
      expect(mockCollection.insertOne.mock.lastCall[0]).toEqual({
        test_column: "hello"
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
        mockCollection.find.mockImplementationOnce(() => {
          return createMockResults(returnData);
        });

        await expect(instance.find("test_table", parameters)).resolves.toEqual(
          rows
        );
        expect(mockDb.collection.mock.lastCall[0]).toBe("test_table");
        expect(mockCollection.find.mock.lastCall[0]).toEqual(query);
      }
    );

    test("rejects if there is an error", async () => {
      mockCollection.find.mockImplementationOnce(() => {
        return { toArray: () => Promise.reject(new Error("Whoops")) };
      });

      await expect(instance.find("test_table", {})).rejects.toThrow("Whoops");
    });
  });
});
