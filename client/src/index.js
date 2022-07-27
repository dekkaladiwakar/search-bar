import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import RoutePage from "./RoutePage";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RoutePage />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
