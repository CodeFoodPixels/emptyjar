import React, { useEffect, useContext } from "react";
import Header from "./Header";
import Charts from "./Charts";
import InfoBar from "./InfoBar";
import RangePicker from "./RangePicker";
import { StateContext } from "../context";

const App = () => {
  const {
    state: { queryDates },
    dispatch
  } = useContext(StateContext);

  useEffect(() => {
    const fetchData = async () => {
      const queryData = {
        to: queryDates.to.toISOString(),
        from: queryDates.from.toISOString()
      };

      const query = Object.keys(queryData)
        .map(
          k => encodeURIComponent(k) + "=" + encodeURIComponent(queryData[k])
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
  }, [queryDates]);

  return (
    <>
      <Header />
      <div className="topbar">
        <InfoBar />
        <RangePicker />
      </div>
      <Charts />
    </>
  );
};

App.displayName = "App";

export default App;
