import React from "react";
import { render } from "react-dom";
import App from "./components/App.js";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";

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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const fromDate = new Date(Date.now() - 86400000 * 6);
fromDate.setUTCHours(0, 0, 0, 0);
const toDate = new Date();
toDate.setUTCHours(23, 59, 59, 999);
const store = createStore(
  reducers,
  {
    queryDates: {
      from: fromDate,
      to: toDate
    },
    data: []
  },
  composeEnhancers(applyMiddleware(fetchMiddleware))
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
