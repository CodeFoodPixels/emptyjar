import React, { useEffect, useContext } from "react";
import Header from "./Header";
import Charts from "./Charts";
import InfoBar from "./InfoBar";
import RangePicker from "./RangePicker";
import Filters from "./Filters";
import { getCountryCode } from "../helpers";
import { StateContext } from "../context";

const App = () => {
  const {
    state: { queryDates, filters },
    dispatch
  } = useContext(StateContext);

  useEffect(() => {
    const fetchData = async () => {
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

      const res = await fetch(`/api/hits?${query}`);

      const data = await res.json();

      dispatch({
        type: "UPDATE_DATA",
        data
      });
    };

    fetchData();
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
        Privacy first analytics powered by{"  "}
        <a
          href="https://github.com/CodeFoodPixels/emptyjar/"
          target="_blank"
          rel="noreferrer noopener"
        >
          EmptyJar
        </a>
      </footer>
    </>
  );
};

App.displayName = "App";

export default App;
