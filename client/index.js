import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.js";
import reducers from "./reducers";
import { StateProvider } from "./context.js";
import { generateInitialState } from "./helpers.js";

const root = createRoot(document.getElementById("root"));
root.render(
  <StateProvider reducer={reducers} initialState={generateInitialState}>
    <App />
  </StateProvider>
);
