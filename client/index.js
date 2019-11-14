import React from "react";
import { render } from "react-dom";
import App from "./components/App.js";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";

const reducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_DATA":
      return {
        ...state,
        data: [...action.data]
      };
  }
  return state;
};

const fetchMiddleware = () => dispatch => async action => {
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

  dispatch(action);
};

const store = createStore(
  reducer,
  {
    data: []
  },
  applyMiddleware(fetchMiddleware)
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
