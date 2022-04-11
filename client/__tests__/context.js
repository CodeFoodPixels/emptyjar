import * as React from "react";
import { renderHook, act } from "@testing-library/react-hooks";

async function setup(args = {}) {
  const returnVal = {};
  function TestComponent() {
    Object.assign(returnVal, React.useContext(StateContext));
    return null;
  }
  render(
    <StateProvider {...args}>
      <TestComponent />
    </StateProvider>
  );
  return returnVal;
}

describe("context", () => {
  it("Should return the state", async () => {
    const { StateProvider, StateContext } = await import("../context");
    const initialState = { test: true };
    const wrapper = ({ children }) => (
      <StateProvider initialState={initialState}>{children}</StateProvider>
    );
    const { result } = renderHook(() => React.useContext(StateContext), {
      wrapper
    });

    expect(result.current.state).toEqual(initialState);
  });

  it("dispatch should run the reducer and update the state", async () => {
    const { StateProvider, StateContext } = await import("../context");
    const initialState = { test: true };
    const reducer = jest.fn((state, update) => {
      return {
        ...state,
        ...update
      };
    });
    const wrapper = ({ children }) => (
      <StateProvider initialState={initialState} reducer={reducer}>
        {children}
      </StateProvider>
    );
    const { result } = renderHook(() => React.useContext(StateContext), {
      wrapper
    });

    expect(result.current.state).toEqual(initialState);

    const newState = { test: false };
    act(() => {
      result.current.dispatch(newState);
    });

    expect(result.current.state).toEqual(newState);
    expect(reducer).toHaveBeenCalledWith(initialState, newState);
  });
});
