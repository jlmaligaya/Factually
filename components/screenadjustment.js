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
        <p>Play in fullscreen for better experience by pressing F11.</p>
        <h2>
          Using ctrl+plus btn/ctrl+minus btn fill the corners of your screen
          with the red box
        </h2>
        <button className="mt-10 font-boom" onClick={handleAdjustmentComplete}>
          Done
        </button>
      </div>
    </div>
  );
};

export default ScreenAdjustment;
