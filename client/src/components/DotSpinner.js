import React from "react";
import "../styles/DotSpinner.css"; // import the CSS file

const DotSpinner = () => {
  return (
    <div className="dot-spinner">
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  );
};

export default DotSpinner;
