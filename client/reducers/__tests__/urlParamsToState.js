import reducer from "../urlParamsToState";

describe("urlParamsToState reducer", () => {
  it("should set state", () => {
    const result = reducer(
      {
        test: true,
        queryDates: {},
        filters: {}
      },
      {
        data: {
          queryDates: {
            to: new Date("2022-04-04"),
            from: new Date("2022-04-03")
          },
          filters: {
            url: "lukeb.co.uk",
            referrer: "google.com"
          }
        }
      }
    );

    expect(result).toEqual({
      test: true,
      queryDates: {
        to: new Date("2022-04-04"),
        from: new Date("2022-04-03")
      },
      filters: {
        url: "lukeb.co.uk",
        referrer: "google.com"
      }
    });
  });

  it("should update state", () => {
    const result = reducer(
      {
        test: true,
        queryDates: {
          to: new Date("2022-04-04"),
          from: new Date("2022-04-03")
        },
        filters: {
          url: "lukeb.co.uk",
          referrer: "google.com"
        }
      },
      {
        data: {
          queryDates: {
            to: new Date("2022-02-01"),
            from: new Date("2022-02-04")
          },
          filters: {
            url: "doineedbuntingtoday.com",
            referrer: "lukeb.co.uk"
          }
        }
      }
    );

    expect(result).toEqual({
      test: true,
      queryDates: {
        to: new Date("2022-02-01"),
        from: new Date("2022-02-04")
      },
      filters: {
        url: "doineedbuntingtoday.com",
        referrer: "lukeb.co.uk"
      }
    });
  });
});
