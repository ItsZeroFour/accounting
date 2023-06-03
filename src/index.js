import React from "react";
import ReactDOM from "react-dom/client";
import "./scss/style.scss";
import App from "./App";
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter basename="/accounting">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </HashRouter>
);
