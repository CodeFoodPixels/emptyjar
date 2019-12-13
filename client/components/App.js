import React, { useEffect } from "react";
import { connect } from "react-redux";
import Header from "./Header";
import Charts from "./Charts";
import InfoBar from "./InfoBar";
import RangePicker from "./RangePicker";

const App = ({ queryDates, fetchData }) => {
  useEffect(() => {
    const to = queryDates.to.toISOString();
    const from = queryDates.from.toISOString();
    fetchData({
      to,
      from
    });
  });

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

export default connect(
  ({ queryDates }) => ({
    queryDates
  }),
  dispatch => ({
    fetchData: params =>
      dispatch({
        type: "FETCH_DATA",
        params
      })
  })
)(App);
