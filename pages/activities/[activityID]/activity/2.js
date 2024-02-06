import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import LoadingScreen from "../../../../components/loading";
import CompletionPage from "../../../../components/completion";
import Image from "next/image";
import Head from "next/head";
import LightsQuestions from "../../../../components/questionlights";

const CaptchaGame = () => {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();
  const userID = session ? session.user.uid : null;
  const activityID = router.query.activityID;
  const [gameData, setGameData] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [verificationState, setVerificationState] = useState("idle"); // 'idle', 'correct', or 'incorrect'
  const [currentGameStateIndex, setCurrentGameStateIndex] = useState(0); // Default to the first game state
  const maxSelections = 3;
  const [lives, setLives] = useState(5);
  const [timer, setTimer] = useState(100);
  const [gameDataLength, setGameDataLength] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [loadingDone, setLoadingDone] = useState(false);
  const calculatedScore = Math.round((100 / gameDataLength) * totalScore);
  const backgroundMusicRef = useRef(null);
  const gameOverRef = useRef(null);
  const gameOver2Ref = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const [initialVolume, setInitialVolume] = useState(0.5);
  const [countdown, setCountdown] = useState(5); // Initial countdown duration in seconds
  const [showCountdown, setShowCountdown] = useState(true);
  const [flashWrongBackground, setFlashWrongBackground] = useState(false);
  const [flashCorrectBackground, setFlashCorrectBackground] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(40); // Initial timer value in seconds
  const [correctAnswers, setCorrectAnswers] = useState(
    Array(gameDataLength).fill(null)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wrongTopics, setWrongTopics] = useState([]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to leave? Your progress will be lost."; // Customize the message here
    };

    const confirmExit = (event) => {
      // Display confirmation prompt
      event.returnValue =
        "Are you sure you want to leave? Your progress will be lost."; // Customize the message here
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Display confirmation prompt before user leaves the page
    window.addEventListener("unload", confirmExit);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", confirmExit);
    };
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to show the modal with custom content
  const showModal = () => {
    setIsModalOpen(true);
  };

  const stopGameOverMusic = () => {
    gameOverRef.current.pause();
    gameOver2Ref.current.pause();
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const shuffleGameData = (data) => {
    return shuffleArray(data).map((gameState) => ({
      ...gameState,
      images: shuffleArray(gameState.images), // Shuffle images
    }));
  };

  useEffect(() => {
    // Only start the countdown and music when loading is done
    if (loadingDone) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      if (countdown < 0) {
        setShowCountdown(false); // Hide the countdown when it reaches zero
      }

      return () => clearInterval(interval);
    }
  }, [countdown, loadingDone]);

  useEffect(() => {
    // Set the volume value in localStorage when it changes
    const savedBgmVolume = parseFloat(localStorage.getItem("bgmVolume"));
    if (!isNaN(savedBgmVolume)) {
      setInitialVolume(savedBgmVolume);
    }
  }, [initialVolume]);

  useEffect(() => {
    // Load and play background music when the component mounts
    backgroundMusicRef.current = new Audio("/sounds/actC3_bgm.ogg");
    backgroundMusicRef.current.volume = initialVolume; // Set the initial volume as needed
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.play();

    gameOverRef.current = new Audio("/sounds/gameOver_bgm.ogg");
    gameOverRef.current.volume = initialVolume; // Set the initial volume as needed
    gameOverRef.current.loop = false;

    gameOver2Ref.current = new Audio("/sounds/gameOver2_bgm.ogg");
    gameOver2Ref.current.volume = initialVolume; // Set the initial volume as needed
    gameOver2Ref.current.loop = false;

    correctSoundRef.current = new Audio("/sounds/correct_sfx.wav");
    correctSoundRef.current.volume = initialVolume; // Set the initial volume as needed
    correctSoundRef.current.loop = false;

    wrongSoundRef.current = new Audio("/sounds/wrong_sfx.wav");
    wrongSoundRef.current.volume = initialVolume; // Set the initial volume as needed
    wrongSoundRef.current.loop = false;

    // Cleanup when the component unmounts
    return () => {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;

      gameOverRef.current.pause();
      gameOverRef.current = null;

      gameOver2Ref.current.pause();
      gameOver2Ref.current = null;
    };
  }, [initialVolume]);

  // Your existing useEffect for fetchGameData
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const result = await fetch(
          `../../../api/imagematch?activityId=${activityID}`
        );
        if (result.ok) {
          const data = await result.json();
          console.log("Fetched game data:", data);

          // Shuffle the order of only images
          const shuffledData = shuffleArray(data).map((gameState) => ({
            ...gameState,
            images: shuffleArray(gameState.images), // Shuffle images
          }));

          setGameData(shuffledData);
          setGameDataLength(shuffledData.length);
          setLoadingDone(true);
        } else {
          console.error("Failed to fetch game data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (activityID) {
      fetchGameData();
    }
  }, [activityID]);

  // Your existing useEffect for managing verification state
  useEffect(() => {
    if (verificationState === "correct") {
      // If verification is correct, preload images for the next game state and reset the state
      // preloadNextGameStateImages();
      setSelectedImages([]);
      setTimeout(() => {
        switchGameState();
        setVerificationState("idle");
      }, 1000);
      setFlashCorrectBackground(true);
      setTimeout(() => {
        setFlashCorrectBackground(false);
      }, 2000); // Adjust the duration to match the animation duration in CSS
    } else if (verificationState === "incorrect") {
      // If verification is incorrect, reset the state after a delay (e.g., 2 seconds)
      setFlashWrongBackground(true);
      setTimeout(() => {
        setFlashWrongBackground(false);
      }, 2000); // Adjust the duration to match the animation duration in CSS
      const timeoutId = setTimeout(() => {
        setSelectedImages([]);
        setVerificationState("idle");
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [verificationState, currentGameStateIndex]);

  const currentGameState = gameData?.[currentGameStateIndex];

  const handleImageClick = (image) => {
    if (verificationState === "correct") {
      return; // Prevent further selection after verification
    }

    if (selectedImages.includes(image)) {
      setSelectedImages(
        selectedImages.filter((selected) => selected !== image)
      );
    } else if (selectedImages.length < maxSelections) {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const isImageSelected = (image) => selectedImages.includes(image);

  const checkWinCondition = () => {
    const correctSelections = selectedImages.filter((image) =>
      currentGameState?.images
        ?.filter((img) => img.value === currentGameState?.title)
        .map((img) => img.url)
        .includes(image)
    );
    return correctSelections.length >= maxSelections;
  };

  const switchGameState = () => {
    setQuestionTimer(40);
    setAlertTriggered(false);
    // Check if all game states have been completed
    if (currentGameStateIndex >= gameData?.length - 1) {
      // All game states have been completed
      setGameCompleted(true);
    } else {
      // Increment the current game state index
      setCurrentGameStateIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    // Set a timer for each question
    const questionInterval = setInterval(() => {
      setQuestionTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Handle the alert when the timer reaches 0
    if (questionTimer === 0 && !alertTriggered) {
      showModal();
      setAlertTriggered(true);
      switchGameState();
    }

    // Clear the interval when the component unmounts or the question changes
    return () => {
      clearInterval(questionInterval);
    };
  }, [questionTimer, alertTriggered, switchGameState]);

  const verifyImages = () => {
    const isCorrect = checkWinCondition();

    if (isCorrect) {
      setVerificationState("correct");
      // Increment the score when verification is correct
      setTotalScore(totalScore + increment);
      // Reset incorrect attempts when the user is correct
      setIncrement(1);
      setIncorrectAttempts(0);
      correctSoundRef.current.play();
      correctSoundRef.current.currentTime = 0;
    } else {
      if (incorrectAttempts === 2) {
        // If the user has tried 3 times, proceed to the next set of pictures
        setVerificationState("incorrect");
        switchGameState();
        setIncorrectAttempts(0); // Reset incorrect attempts
        setIncrement(1);
        wrongSoundRef.current.play();
        wrongSoundRef.current.currentTime = 0;
      } else {
        setIncorrectAttempts(incorrectAttempts + 1);
        setIncrement(increment - 0.3333333333);
        console.log("Add points: ", increment);
        setVerificationState("incorrect");
        wrongSoundRef.current.play();
        wrongSoundRef.current.currentTime = 0;
      }
      setLives(lives - 1);
    }

    // Update correct answers
    setCorrectAnswers((prevCorrectAnswers) => {
      const updatedCorrectAnswers = [...prevCorrectAnswers];
      updatedCorrectAnswers[currentGameStateIndex] = isCorrect;
      return updatedCorrectAnswers;
    });
  };

  useEffect(() => {
    if (verificationState === "incorrect") {
      // If verification is incorrect, add the current topic to the list of incorrect topics
      setWrongTopics((prevWrongTopics) => {
        const updatedTopics = new Set([
          ...prevWrongTopics,
          gameData[currentGameStateIndex]?.title,
        ]);
        return [...updatedTopics];
      });
      console.log(wrongTopics);
    }
  }, [verificationState]);

  // const preloadNextGameStateImages = () => {
  //   const nextGameState =
  //     gameData?.[(currentGameStateIndex + 1) % (gameData?.length || 1)];
  //   nextGameState?.images?.forEach((image) => {
  //     const img = new Image();
  //     img.src = image.url;
  //   });
  // };

  useEffect(() => {
    if (currentGameStateIndex === gameData?.length) {
      // All game states have been completed
      setGameCompleted(true);
    } else {
      // Reset the gameCompleted state if not all game states are completed
      setGameCompleted(false);
    }
  }, [currentGameStateIndex]);

  // Timer Effect
  useEffect(() => {
    if (!showCountdown) {
      // Start the timer when showCountdown becomes false (after "GO!" is displayed)
      const timerInterval = setInterval(() => {
        if (timer === 0) {
          // Handle timer reaching zero
          clearInterval(timerInterval);
        } else {
          setTimer((prevTimer) => prevTimer - 1);
        }
      }, 1000);

      // Clear the timer interval when the quiz ends
      if (gameCompleted) {
        clearInterval(timerInterval);
      }

      return () => clearInterval(timerInterval);
    }
  }, [showCountdown, timer, gameCompleted]);

  const handleEndGame = () => {
    if (lives === 0 || timer === 0 || gameCompleted) {
      backgroundMusicRef.current.pause();
      if (calculatedScore > 34) {
        gameOverRef.current.play();
      } else {
        gameOver2Ref.current.play();
      }
      setGameCompleted(true);
      postScore(userID, activityID, calculatedScore, 100 - timer);
    }
  };

  const postScore = async (uid, aid, score, timeFinished) => {
    try {
      const response = await axios.post("/api/scores", {
        uid,
        aid,
        score,
        timeFinished,
      });
      console.log("Score posted successfully", response.data);
    } catch (error) {
      console.error("Error posting score", error);
    }
  };

  const resetGame = () => {
    gameOverRef.current.pause();
    gameOver2Ref.current.pause();
    backgroundMusicRef.current.play();
    gameOverRef.current.currentTime = 0;
    gameOver2Ref.current.currentTime = 0;
    backgroundMusicRef.current.currentTime = 0;
    setWrongTopics(new Set());
    const shuffledGameData = shuffleGameData(gameData);
    setGameData(shuffledGameData);
    setCorrectAnswers(Array(gameDataLength).fill(null));

    setCountdown(5);
    setShowCountdown(true);
    setGameCompleted(false);
    setLives(5);
    setTimer(100);
    setCurrentGameStateIndex(0);
    setSelectedImages([]);
    setTotalScore(0);
    setVerificationState("idle");
  };

  const gameContent = (
    <div
      className={`bg-[url("/chapters/1/actC1_bg.jpg")]' } flex h-screen w-full flex-col items-center justify-center
      gap-4`}
      style={{ backgroundSize: "100% 100%" }}
    >
      <div className="absolute top-10 flex w-full animate-bounce items-center gap-4 px-10">
        {[...Array(lives)].map((_, i) => (
          <div key={i} className="relative h-10">
            {i < lives ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="red"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                className="h-20 w-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="red"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                className="h-16 w-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div className="absolute top-10 right-4">
        {" "}
        <LightsQuestions
          questionCount={gameDataLength}
          correctAnswers={correctAnswers}
          currentQuestionIndex={currentGameStateIndex}
        />
      </div>

      <div
        className="absolute top-0 left-0 h-5 bg-red-500"
        style={{ width: `${(timer / 100) * 100}%` }}
      ></div>

      <div className="text-with-stroke mt-20 flex h-[100px] w-1/2 items-center justify-center rounded-md border-4 border-gray-600 bg-slate-500 text-center font-ogoby text-4xl">
        Select 3 images that matches the current category.
      </div>
      <div
        className={`flex w-[600px] flex-col rounded-lg border-4 bg-white p-10 ${
          verificationState === "correct"
            ? "border-green-500"
            : verificationState === "incorrect"
            ? "border-red-500"
            : "border-slate-500"
        }`}
      >
        <h2 className="text-with-stroke mb-4 rounded-full border-4 border-red-300 bg-red-100 p-5 text-center font-ogoby text-5xl text-white">
          {currentGameState?.title.toUpperCase()}
        </h2>
        <div className="grid select-none grid-cols-3 gap-4">
          {currentGameState?.images?.map((image) => (
            <div
              key={image.id}
              className={`flex cursor-pointer  justify-center hover:scale-105 ${
                isImageSelected(image.url)
                  ? "border-4 border-green-500"
                  : "border-4 border-gray-300"
              } ${
                selectedImages.length >= maxSelections &&
                !isImageSelected(image.url)
                  ? "pointer-events-none opacity-50"
                  : ""
              } ${
                verificationState === "incorrect" &&
                currentGameState?.images
                  ?.filter((img) => img.value === currentGameState?.title)
                  .map((img) => img.url)
                  .includes(image.url)
                  ? "border border-red-500"
                  : ""
              }`}
              onClick={() => handleImageClick(image.url)}
            >
              <Image
                src={`${image.url}`}
                height={150}
                width={150}
                alt={`Captcha ${image.id}`}
                className="pointer-events-none flex"
              />
            </div>
          ))}
        </div>
        <button
          onClick={verifyImages}
          className={`mt-4 flex justify-center px-4 py-2 font-retropix text-xl uppercase ${
            verificationState === "correct"
              ? "bg-green-500 text-white"
              : verificationState === "incorrect"
              ? "bg-red-500 text-white"
              : "bg-slate-500 text-white"
          } rounded hover:bg-red-600 ${
            selectedImages.length === maxSelections
              ? ""
              : "pointer-events-none opacity-50"
          }`}
          disabled={
            verificationState === "incorrect" || verificationState === "correct"
          }
        >
          {verificationState === "correct" ? "Correct!" : "Verify"}
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    handleEndGame();
  }, [lives, timer, gameCompleted]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[url('/chapters/1/actC1_bg.jpg')]">
      <Head>
        <title>Image Match</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div className="h-30 flex w-80 flex-col items-center justify-center rounded-lg border-4 border-red-500 bg-white p-10 text-center font-ogoby text-xl text-black">
            <p className="text-center">Are you still there?</p>
            <div className="mt-4 flex justify-center">
              <button
                className="mr-2 rounded-lg bg-red-500 px-4 py-2 text-white"
                onClick={closeModal}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
      {!loadingDone ? (
        <LoadingScreen /> // Render loading screen while data is being fetched
      ) : showCountdown && loadingDone ? ( // Render the countdown overlay if showCountdown is true
        <div
          className="text-with-stroke flex h-screen w-full items-center justify-center font-ogoby text-9xl text-white"
          style={{
            background: 'url("/chapters/1/actC1_bg.jpg")',
            backgroundSize: "cover",
          }}
        >
          {countdown === 0 ? <h1>GO!</h1> : <h1>{countdown}</h1>}
        </div>
      ) : gameCompleted ? (
        <CompletionPage
          activityID={activityID}
          calculatedScore={calculatedScore}
          timeFinished={100 - timer}
          resetGame={resetGame}
          stopGameOverMusic={() => stopGameOverMusic()}
          wrongTopics={wrongTopics}
        />
      ) : (
        gameContent
      )}
      {flashWrongBackground && (
        <div
          className="absolute top-0 left-0 h-full w-full bg-opacity-50" /* Adjust the background color */
          style={{
            animation: "flash-wrong 0.5s ease 1",
          }} /* Adjust the animation duration */
        ></div>
      )}
      {flashCorrectBackground && (
        <div
          className="absolute top-0 left-0 h-full w-full bg-opacity-50" /* Adjust the background color */
          style={{
            animation: "flash-correct 0.5s ease 1",
          }} /* Adjust the animation duration */
        ></div>
      )}
    </div>
  );
};

export default CaptchaGame;
