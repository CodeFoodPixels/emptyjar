import React from "react";
import { render } from "react-dom";
import App from "./components/App.js";
import reducers from "./reducers";
import { StateProvider } from "./context.js";
import { stateFromUrlParams } from "./helpers.js";

const urlParams = stateFromUrlParams(window.location.href);
const fromDate = new Date(Date.now() - 86400000 * 6);
fromDate.setHours(0, 0, 0, 0);
const toDate = new Date();
toDate.setHours(23, 59, 59, 999);
const initialState = {
  queryDates: {
    from: fromDate,
    to: toDate,
    ...urlParams.queryDates
  },
  filters: { ...urlParams.filters },
  data: []
};

render(
  <StateProvider reducer={reducers} initialState={initialState}>
    <App />
  </StateProvider>,
  document.getElementById("root")
);
