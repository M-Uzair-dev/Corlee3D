import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({
  text = "Loading...",
  fullPage = false,
  overlay = false,
}) => {
  const content = (
    <div className="spinner-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-border"></div>
      </div>
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );

  // Full page spinner
  if (fullPage) {
    return <div className="full-page-spinner">{content}</div>;
  }

  // Overlay spinner (positioned absolutely within a relative container)
  if (overlay) {
    return <div className="spinner-overlay">{content}</div>;
  }

  // Regular spinner
  return content;
};

export default LoadingSpinner;
