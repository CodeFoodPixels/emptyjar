import reducer from "../loading";

describe("loading reducer", () => {
  it("should set loading to true", () => {
    const result = reducer(
      {
        test: true,
        loading: false
      },
      { value: true }
    );

    expect(result).toEqual({
      test: true,
      loading: true
    });
  });

  it("should set loading to false", () => {
    const result = reducer(
      {
        test: true,
        loading: true
      },
      { value: false }
    );

    expect(result).toEqual({
      test: true,
      loading: false
    });
  });
});
