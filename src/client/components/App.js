import React from "react";
import State from "../state";
import Container from "./Container";

export default () => {
  return (
    <State.Provider>
      <Container />
    </State.Provider>
  );
};
