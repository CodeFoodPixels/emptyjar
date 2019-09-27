import React from "react";
import Header from "./Header";
import Filters from "./Filters";
import Charts from "./Charts";

const App = () => {
  return (
    <>
      <Header />
      <Filters />
      <Charts />
    </>
  );
};

App.displayName = "App";

export default App;
