import React from "react";
import ReactDOM from "react-dom/client";
import Approuter from "./Routes/Approuter";
import "./root.css";
import "./assets/css/responsive-tables.css";
import AOS from "aos";
import "aos/dist/aos.css";

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  easing: 'ease-out-cubic',
  mirror: true,
  offset: 50
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Approuter />
  </React.StrictMode>
);
