// components/CompletionPage.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cutscene from "./cutscene";
import LoadingScreen from "./loading";
import LeaderboardModal from "./statisticsmodal";
import { faK } from "@fortawesome/free-solid-svg-icons";

const CompletionPage = ({
  calculatedScore,
  timeFinished,
  resetGame,
  stopGameOverMusic,
  activityID,
}) => {
  const [showCutscene, setShowCutscene] = useState(false);
  const [cutsceneFinished, setCutsceneFinished] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleReturnToMainMenu = () => {
    stopGameOverMusic();
    setShowCutscene(true);
  };

  const handleCutsceneFinished = () => {
    // This function is called when the cutscene finishes
    setCutsceneFinished(true);
    setIsLoading(true);
    // You can navigate to the main menu here if needed
    router.push("/");
  };

  const handleLeaderboards = () => {
    setShowLeaderboard(true);
    setButtonClicked(true);
  };

  useEffect(() => {
    // If the cutscene has finished, navigate to the main menu
    if (cutsceneFinished) {
      setIsLoading(true);
      router.push("/");
    }
  }, [cutsceneFinished, router]);

  return (
    <div className="h-1/8 flex w-1/2 flex-col items-center justify-center gap-8 rounded-xl border-8 bg-white p-8 font-medium shadow-lg">
      {isLoading && <LoadingScreen />}
      {/* Render loading screen when isLoading is true */}

      {showCutscene &&
        !isLoading && ( // Render Cutscene when not loading
          <Cutscene
            isIntro={false}
            activityID={activityID}
            onClose={handleCutsceneFinished}
          />
        )}

      <div className="w-full text-center">
        <h1 className="text-with-stroke mb-2 font-boom text-4xl text-red-700">
          Quiz Summary
        </h1>
        <hr className="mx-auto w-16 border-red-500" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full flex-col items-center justify-center border-b-2 border-red-500 pb-4">
          <h2 className="text-with-stroke mb-4 font-ogoby text-4xl">
            Your score
          </h2>
          <h2 className="text-with-stroke font-ogoby text-6xl">
            {calculatedScore}
          </h2>
          <div className="mb-4 font-ogoby text-3xl text-gray-600">
            Time: {timeFinished}s
          </div>
          {/* Conditionally render the caption */}
          {calculatedScore === 100 && (
            <div className="font-retropix text-3xl text-black">
              Excellent job! Keep it up!
            </div>
          )}
          {calculatedScore >= 67 && calculatedScore < 80 && (
            <div className="font-retropix text-3xl text-black">
              Great job! Can you go higher?
            </div>
          )}
          {calculatedScore >= 34 && calculatedScore < 60 && (
            <div className="font-retropix text-3xl text-black">
              You can do better!
            </div>
          )}
          {calculatedScore < 34 && (
            <div className="font-retropix text-3xl text-black">
              Keep trying! You can do it!
            </div>
          )}
        </div>

        {/* Stars */}
        {!isLoading && (
          <div className="flex items-center">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className={`h-16 w-16 ${
                  calculatedScore >= ((index + 1) / 3) * 100
                    ? "fadeIn"
                    : "hidden"
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
        )}
      </div>
      <div className="flex w-full justify-center gap-4">
        <button
          className="flex items-center justify-center rounded-md bg-red-500 p-3 font-boom text-white hover:bg-red-600"
          onClick={resetGame}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
        <button
          className={`flex items-center justify-center rounded-md bg-red-500 p-3 font-boom text-white hover:bg-red-600`}
          onClick={handleLeaderboards}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        </button>
        <button
          className="flex items-center justify-center rounded-md bg-red-500 p-3 font-boom text-white hover:bg-red-600"
          onClick={handleReturnToMainMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
            />
          </svg>
        </button>
      </div>
      {showLeaderboard && (
        <LeaderboardModal
          onClose={() => setShowLeaderboard(false)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        />
      )}
    </div>
  );
};

export default CompletionPage;
