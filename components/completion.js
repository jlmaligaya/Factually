// components/CompletionPage.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cutscene from "./cutscene";

const CompletionPage = ({ calculatedScore, timeFinished, resetGame, stopGameOverMusic }) => {
  const [showCutscene,setShowCutscene] = useState(false)
  const [cutsceneFinished, setCutsceneFinished] = useState(false);
  const router = useRouter();

  const handleReturnToMainMenu = () => {
    stopGameOverMusic();
    setShowCutscene(true);
  };

  const handleCutsceneFinished = () => {
    // This function is called when the cutscene finishes
    setCutsceneFinished(true);

    // You can navigate to the main menu here if needed
    router.push("/");
  };

  
  useEffect(() => {
    // If the cutscene has finished, navigate to the main menu
    if (cutsceneFinished) {
      router.push("/");
    }
  }, [cutsceneFinished, router]);


  return (
    <div className="w-1/2 h-1/8 border-8 rounded-xl bg-white flex flex-col justify-center items-center font-medium gap-8 p-8 shadow-lg">
      {showCutscene && (
        <Cutscene isIntro={false} onClose={handleCutsceneFinished} />
      )}
      <div className="w-full text-center">
        <h1 className="text-4xl font-boom text-red-700 mb-2 text-with-stroke">
          Quiz Summary
        </h1>
        <hr className="border-red-500 w-16 mx-auto" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full flex flex-col justify-center items-center border-b-2 border-red-500 pb-4">
          <h2 className="text-4xl font-ogoby text-with-stroke mb-4">Your score</h2>
          <h2 className="text-6xl font-ogoby text-with-stroke">{calculatedScore}</h2>
          <div className="text-3xl font-ogoby text-gray-600 mb-4">Time: {timeFinished}s</div>
          {/* Conditionally render the caption */}
          {calculatedScore === 100 && (
            <div className="text-3xl font-retropix text-black">Excellent job! Keep it up!</div>
          )}
          {calculatedScore >= 67 && calculatedScore < 80 && (
            <div className="text-3xl font-retropix text-black">Great job! Can you go higher?</div>
          )}
          {calculatedScore >= 34 && calculatedScore < 60 && (
            <div className="text-3xl font-retropix text-black">Nice! You can do better!</div>
          )}
          {calculatedScore < 34 && (
            <div className="text-3xl font-retropix text-black">Keep trying! You can do it!</div>
          )}
          
        </div>

        {/* Stars */}
        <div className="flex items-center">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className={`w-16 h-16 ${
                calculatedScore >= ((index + 1) / 3) * 100 ? 'fadeIn' : 'hidden'
              } transition-opacity duration-1000`}
            >
              {/* Insert your star SVG or image here */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="yellow"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="black"
                className="w-100 h-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.040.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-center gap-4">
        <button
          className="bg-red-500 hover:bg-red-600 flex justify-center items-center text-white font-boom rounded-md p-3"
          onClick={resetGame}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
        <button
        className="bg-red-500 hover:bg-red-600 flex justify-center items-center text-white font-boom rounded-md p-3"
        onClick={handleReturnToMainMenu}
        
      >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CompletionPage;
