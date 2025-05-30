import React from "react";
import ReactDOM from "react-dom/client";
import Approuter from "./Routes/Approuter";
import "./root.css";
import "./assets/css/responsive-tables.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Approuter />
  </React.StrictMode>
);
