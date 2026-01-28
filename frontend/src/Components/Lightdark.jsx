import React from "react";
import "./LightDark.css";

function LightDark() {
  return (
    <div className="radio-input">
      <label className="switch" for="">
        <input
          className="plus1"
          id="value-1"
          type="radio"
          name="color-scheme"
          value="light dark"
          checked
        />
      </label>

      <label className="switch" for="">
        <input
          className="plus2"
          id="value-2"
          type="radio"
          name="color-scheme"
          value="light"
        />
      </label>

      <label className="switch" for="">
        <input
          className="plus3"
          id="value-3"
          type="radio"
          name="color-scheme"
          value="dark"
        />
      </label>
    </div>
  );
}

export default LightDark;
