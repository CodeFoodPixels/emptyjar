import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

const Filters = ({ fetchData }) => {
  const [state, setState] = useState({
    time_from: Math.floor((Date.now() - 86400000 * 7) / 1000),
    time_to: Math.floor(Date.now() / 1000)
  });

  function _onClick() {
    setState({ time_from: Math.floor((Date.now() - 86400000 * 2) / 1000) });
  }

  useEffect(() => {
    fetchData(state);
  });

  return (
    <section className="filters">
      <button onClick={_onClick}>CLICK ME!</button>
    </section>
  );
};

Filters.displayName = "Filters";

export default connect(
  null,
  dispatch => ({
    fetchData: params =>
      dispatch({
        type: "FETCH_DATA",
        params
      })
  })
)(Filters);
