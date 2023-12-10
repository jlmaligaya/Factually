import React, { useState, useEffect } from "react";

const ScreenAdjustment = ({ onFinishAdjustment }) => {
  const [adjustmentCompleted, setAdjustmentCompleted] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [countdown, setCountdown] = useState(5); // Initial countdown value in seconds

  const handleAdjustmentComplete = () => {
    setAdjustmentCompleted(true);
    onFinishAdjustment();
  };

  const enableButtonAfterDelay = () => {
    setTimeout(() => {
      setButtonEnabled(true);
    }, 5000); // 5000 milliseconds (5 seconds) delay
  };

  useEffect(() => {
    enableButtonAfterDelay();

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div className={`screen-adjustment ${adjustmentCompleted ? "hidden" : ""}`}>
      <div className="adjustment-content flex flex-col items-center justify-center font-retropix text-xl uppercase text-black">
        <p style={{ display: "flex", alignItems: "center" }}>
          To enhance your experience, play in fullscreen by pressing{" "}
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/f11-key.png"
            alt="f11-key"
            className="animate-bounce p-1"
          />
          .
        </p>
        <h2 style={{ display: "flex", alignItems: "center" }}>
          Hold{" "}
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/ctrl.png"
            alt="ctrl"
            className="p-1"
          />
          then press
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/plus-2-math.png"
            alt="plus-2-math"
            className="p-1"
          />
          or
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios/50/minus-2-math.png"
            alt="minus-2-math"
            className="p-1"
          />{" "}
          until the red box fits in your screen corners.
        </h2>
        <button
          className={`mt-10 bg-red-500 font-retropix hover:bg-red-600 ${
            buttonEnabled ? "" : "cursor-not-allowed opacity-50"
          }`}
          onClick={handleAdjustmentComplete}
          disabled={!buttonEnabled}
        >
          {buttonEnabled ? `DONE` : `ENABLED IN ${countdown}s`}
        </button>
      </div>
    </div>
  );
};

export default ScreenAdjustment;
