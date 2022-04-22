import React, { useEffect, useContext } from "react";
import Header from "./Header";
import Charts from "./Charts";
import InfoBar from "./InfoBar";
import RangePicker from "./RangePicker";
import Filters from "./Filters";
import { getCountryCode, stateFromUrlParams } from "../helpers";
import { StateContext } from "../context";
import { mapNameToURLs } from "../referrerMap";
import { UPDATE_DATA, UPDATE_LOADING, URL_PARAMS_TO_STATE } from "../constants";

const App = () => {
  const {
    state: { queryDates, filters },
    dispatch
  } = useContext(StateContext);

  useEffect(() => {
    window.addEventListener("popstate", e => {
      dispatch({
        type: URL_PARAMS_TO_STATE,
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

      dispatch({
        type: UPDATE_LOADING,
        value: true
      });

      if (queryData.country && queryData.country !== "Unknown") {
        queryData.country = getCountryCode(queryData.country);
      }
      const queryKeys = Object.keys(queryData).filter(key => queryData[key]);

      const windowQuery = queryKeys
        .map(
          key =>
            encodeURIComponent(key) + "=" + encodeURIComponent(queryData[key])
        )
        .join("&");

      const apiQuery = queryKeys
        .reduce((data, key) => {
          if (key === "referrer") {
            const urls = mapNameToURLs(queryData[key]);

            if (Array.isArray(urls)) {
              urls.forEach(url => {
                data.push(
                  encodeURIComponent(key) + "=" + encodeURIComponent(url)
                );
              });
            } else {
              data.push(
                encodeURIComponent(key) +
                  "=" +
                  encodeURIComponent(queryData[key])
              );
            }
          } else {
            data.push(
              encodeURIComponent(key) + "=" + encodeURIComponent(queryData[key])
            );
          }
          return data;
        }, [])
        .join("&");

      if (window.location.search !== `?${windowQuery}`) {
        history.replaceState({}, "", `?${windowQuery}`);
      }
      const res = await fetch(`/api/hits?${apiQuery}`);

      const data = await res.json();

      dispatch({
        type: UPDATE_DATA,
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
