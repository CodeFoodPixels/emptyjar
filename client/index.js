import React from "react";
import { render } from "react-dom";
import App from "./components/App.js";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";
import { StateProvider } from "./context.js";

const fetchMiddleware = () => dispatch => async action => {
  if (action.type === "FETCH_DATA") {
  }

  dispatch(action);
};
const fromDate = new Date(Date.now() - 86400000 * 6);
fromDate.setUTCHours(0, 0, 0, 0);
const toDate = new Date();
toDate.setUTCHours(23, 59, 59, 999);
const initialState = {
  queryDates: {
    from: fromDate,
    to: toDate
  },
  data: []
};

render(
  <StateProvider reducer={reducers} initialState={initialState}>
    <App />
  </StateProvider>,
  document.getElementById("root")
);
