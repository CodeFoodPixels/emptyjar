import React, { createContext, useReducer } from "react";

const State = createContext();
const Dispatch = createContext();

const initialState = {
  data: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_DATA":
      return {
        ...state,
        data: [...action.data]
      };
  }
  return state;
};

const fetchMiddleware = dispatch => async action => {
  if (action.type === "FETCH_DATA") {
    const query = Object.keys(action.params)
      .map(
        k => encodeURIComponent(k) + "=" + encodeURIComponent(action.params[k])
      )
      .join("&");

    const res = await fetch(`/api/hits?${query}`);

    const data = await res.json();

    dispatch({
      type: "UPDATE_DATA",
      data
    });
  }
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <State.Provider value={state}>
      <Dispatch.Provider value={fetchMiddleware(dispatch)}>
        {children}
      </Dispatch.Provider>
    </State.Provider>
  );
};

export default {
  State,
  Dispatch,
  Provider
};
