import { UPDATE_LOADING } from "../..//constants";
import reduce from "../index";
import loading from "../loading";

jest.mock("../loading");
loading.mockImplementation(jest.fn(() => ({ test: true })));

describe("reducers index", () => {
  it("should call a reducer and return the updated state if there's a matching action", () => {
    const result = reduce({}, { type: UPDATE_LOADING });

    expect(result).toEqual({ test: true });
    expect(loading).toHaveBeenCalledWith({}, { type: UPDATE_LOADING });
  });

  it("should return the state if there's no matching action", () => {
    const result = reduce({ test: true }, { type: "SHIVER_ME_TIMBERS" });

    expect(result).toEqual({ test: true });
  });
});
