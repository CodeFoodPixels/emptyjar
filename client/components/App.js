import React, { useEffect, useContext } from "react";
import Header from "./Header";
import Charts from "./Charts";
import InfoBar from "./InfoBar";
import RangePicker from "./RangePicker";
import Filters from "./Filters";
import { getCountryCode, stateFromUrlParams } from "../helpers";
import { StateContext } from "../context";

const App = () => {
  const {
    state: { queryDates, filters },
    dispatch
  } = useContext(StateContext);

  useEffect(() => {
    window.addEventListener("popstate", e => {
      dispatch({
        type: "URL_PARAMS",
        data: stateFromUrlParams(window.location.href)
      });
    });
  }, []);

  useEffect(() => {
    (async () => {
      const queryData = {
        to: queryDates.to.toISOString(),
        from: queryDates.from.toISOString(),
        ...filters
      };

      if (queryData.country && queryData.country !== "Unknown") {
        queryData.country = getCountryCode(queryData.country);
      }
      const query = Object.keys(queryData)
        .filter(key => queryData[key])
        .map(
          key =>
            encodeURIComponent(key) + "=" + encodeURIComponent(queryData[key])
        )
        .join("&");

      if (window.location.search !== `?${query}`) {
        history.pushState({}, "", `?${query}`);
      }
      const res = await fetch(`/api/hits?${query}`);

      const data = await res.json();

      dispatch({
        type: "UPDATE_DATA",
        data
      });
    })();
  }, [queryDates, filters]);

  return (
    <>
      <Header />
      <div className="topbar">
        <InfoBar />
        <RangePicker />
      </div>
      <Filters />
      <Charts />
      <footer className="footer">
        <div className="footer__content">
          Privacy first analytics powered by{"  "}
          <a
            href="https://github.com/CodeFoodPixels/emptyjar/"
            target="_blank"
            rel="noreferrer noopener"
          >
            EmptyJar
          </a>
        </div>
      </footer>
    </>
  );
};

App.displayName = "App";

export default App;
