import reducer from "../queryDates";

describe("queryDates reducer", () => {
  it("should set queryDates", () => {
    const result = reducer(
      {
        test: true,
        queryDates: {}
      },
      {
        queryDates: { to: new Date("2022-04-04"), from: new Date("2022-04-03") }
      }
    );

    expect(result).toEqual({
      test: true,
      queryDates: { to: new Date("2022-04-04"), from: new Date("2022-04-03") }
    });
  });

  it("should update queryDates", () => {
    const result = reducer(
      {
        test: true,
        queryDates: { to: new Date("2022-04-04"), from: new Date("2022-04-03") }
      },
      {
        queryDates: { to: new Date("2022-02-01"), from: new Date("2022-02-11") }
      }
    );

    expect(result).toEqual({
      test: true,
      queryDates: { to: new Date("2022-02-01"), from: new Date("2022-02-11") }
    });
  });
});
