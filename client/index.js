import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.js";
import reducers from "./reducers";
import { StateProvider } from "./context.js";
import { stateFromUrlParams } from "./helpers.js";
import { ONE_DAY } from "./constants.js";

const urlParams = stateFromUrlParams(window.location.href);
const fromDate = new Date(Date.now() - ONE_DAY * 6);
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
  loading: false,
  data: []
};
const root = createRoot(document.getElementById("root"));
root.render(
  <StateProvider reducer={reducers} initialState={initialState}>
    <App />
  </StateProvider>
);
