// ScreenAdjustment.js

import React, { useState } from "react";

const ScreenAdjustment = ({ onFinishAdjustment }) => {
  const [adjustmentCompleted, setAdjustmentCompleted] = useState(false);

  const handleAdjustmentComplete = () => {
    setAdjustmentCompleted(true);
    onFinishAdjustment();
  };

  return (
    <div className={`screen-adjustment ${adjustmentCompleted ? "hidden" : ""}`}>
      <div className="adjustment-content flex flex-col items-center justify-center font-retropix text-xl uppercase text-black">
        <p style={{ display: "flex", alignItems: "center" }}>
          Play in fullscreen for better experience by pressing{" "}
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/f11-key.png"
            alt="f11-key"
            className="p-1"
          />
          .
        </p>
        <h2 style={{ display: "flex", alignItems: "center" }}>
          Using{" "}
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/ctrl.png"
            alt="ctrl"
            className="p-1"
          />
          +
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/plus-2-math.png"
            alt="plus-2-math"
            className="p-1"
          />
          /{" "}
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/ctrl.png"
            alt="ctrl"
            className="p-1"
          />
          +
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/minus-2-math.png"
            alt="minus-2-math"
            className="p-1"
          />{" "}
          fit the red box in the corners of your screen.
        </h2>
        <button
          className="mt-10 bg-red-500 font-boom hover:bg-red-600"
          onClick={handleAdjustmentComplete}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ScreenAdjustment;
