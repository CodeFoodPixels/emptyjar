import React, { useContext, useEffect } from "react";
import State from "../state";
import Header from "./Header";
import Filters from "./Filters";
import Charts from "./Charts";

export default () => {
  const dispatch = useContext(State.Dispatch);

  useEffect(() => {
    dispatch({
      type: "FETCH_DATA",
      params: {}
    });
  }, []);

  return (
    <>
      <Header />
      <Filters />
      <Charts />
    </>
  );
};
