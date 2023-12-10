import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingScreen from "../../../../components/loading";
import CompletionPage from "../../../../components/completion";

const Index = () => {
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [questionLength, setQuestionLength] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timer, setTimer] = useState(100);
  const [lostLives, setLostLives] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [choice, setChoice] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const userID = session ? session.user.uid : null;
  const activityID = router.query.activityID;
  const [loadingDone, setLoadingDone] = useState(false);
  const calculatedScore = Math.round((100 / questionLength) * totalScore);
  const backgroundMusicRef = useRef(null);
  const gameOverRef = useRef(null);
  const gameOver2Ref = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const [initialVolume, setInitialVolume] = useState(0.5);
  const [countdown, setCountdown] = useState(5); // Initial countdown duration in seconds
  const [showCountdown, setShowCountdown] = useState(true);
  const [flashBackground, setFlashBackground] = useState(false);

  const stopGameOverMusic = () => {
    gameOverRef.current.pause();
    gameOver2Ref.current.pause();
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
    backgroundMusicRef.current = new Audio("/sounds/actC1_bgm.ogg");
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

  // Fetches the questions from API only once
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (quizQuestions.length === 0) {
          const result = await fetch(
            `../../../api/questions?activityId=${activityID}`
          );
          const data = await result.json();
          setQuizQuestions(data);
          setQuestionLength(data.length);
          setQuizStarted(true);
          setLoadingDone(true);
          console.log("Data: ", data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [activityID, quizQuestions]);

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
      if (quizEnded) {
        clearInterval(timerInterval);
      }

      return () => clearInterval(timerInterval);
    }
  }, [showCountdown, timer, quizEnded]);

  const postScore = async (uid, aid, score, timeFinished) => {
    try {
      const response = await axios.post("/api/scores", {
        uid,
        aid,
        score,
        timeFinished,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleChoice = (choice) => {
    if (
      choice === quizQuestions[questionNumber]?.correct_option &&
      !isQuestionAnswered
    ) {
      setIsQuestionAnswered(true);
      setTotalScore(totalScore + 1);
      correctSoundRef.current.play();
      correctSoundRef.current.currentTime = 0;
    } else if (
      choice !== quizQuestions[questionNumber]?.correct_option &&
      !isQuestionAnswered
    ) {
      setIsQuestionAnswered(true);
      setLostLives([...lostLives, lives - 1]);
      setLives(lives - 1);
      wrongSoundRef.current.play();
      wrongSoundRef.current.currentTime = 0;

      // Trigger the flash animation
      setFlashBackground(true);
      setTimeout(() => {
        setFlashBackground(false);
      }, 500); // Adjust the duration to match the animation duration in CSS
    } else {
      alert("You have already answered this question");
    }
    setChoice(choice);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleEndQuiz = () => {
    if (quizStarted && (lives === 0 || timer === 0 || quizEnded)) {
      backgroundMusicRef.current.pause();
      if (calculatedScore > 34) {
        gameOverRef.current.play();
      } else {
        gameOver2Ref.current.play();
      }
      postScore(userID, activityID, calculatedScore, 100 - timer);
      setQuizEnded(true);
      // Only post the score when the quiz ends
    }
  };

  const handleRestartQuiz = () => {
    gameOverRef.current.pause();
    gameOver2Ref.current.pause();
    backgroundMusicRef.current.play();
    gameOverRef.current.currentTime = 0;
    gameOver2Ref.current.currentTime = 0;
    backgroundMusicRef.current.currentTime = 0;
    setCountdown(5);
    setShowCountdown(true);
    setLives(5);
    setTimer(100);
    setQuestionNumber(0);
    setQuizEnded(false);
    setIsQuestionAnswered(false);
    setTotalScore(0);
    setQuizQuestions(shuffleArray(quizQuestions));
    setChoice(null);
    setLostLives([]);
  };

  useEffect(() => {
    handleEndQuiz();
  }, [lives, timer, quizEnded]);

  const moveToNextQuestion = () => {
    // Check if there are more questions and proceed to the next question
    if (questionNumber + 1 < questionLength) {
      setQuestionNumber(questionNumber + 1);
      setIsQuestionAnswered(false); // Reset the flag when moving to the next question
      setChoice(null); // Reset the choice
    } else {
      // No more questions, end the quiz
      setQuizEnded(true);
      handleEndQuiz();
    }
  };

  return (
    <>
      {showCountdown && loadingDone ? ( // Render the countdown overlay if showCountdown is true
        <div className="flex h-screen w-full items-center justify-center font-ogoby text-9xl text-white">
          {countdown === 0 ? <h1>GO!</h1> : <h1>{countdown}</h1>}
        </div>
      ) : quizQuestions?.length > 0 && loadingDone ? (
        <div className="flex h-screen w-full items-center justify-center">
          {!quizEnded ? (
            <div className="flex h-screen w-full items-center justify-center">
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-16 bg-[url('/chapters/1/actC1_bg.jpg')] bg-cover bg-center font-medium text-white"
                style={{ backgroundSize: "100% 100%" }}
              >
                <div className="absolute top-0 flex w-full justify-between px-10">
                  {/* lives */}
                  <div className="mt-10 flex items-center gap-10">
                    {[...Array(lives)].map((_, i) => (
                      <div key={i} className="relative mr-2 h-6 w-6">
                        {lostLives.includes(i) ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="red"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="black"
                            className="h-6 w-6"
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
                            className="h-6 w-6"
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
                  {/* timer */}
                  <div
                    className="absolute top-0 left-0 h-5 bg-red-500"
                    style={{ width: `${(timer / 100) * 100}%` }}
                  ></div>
                </div>
                <div className="flex h-full w-full flex-col items-center justify-center gap-8">
                  <div
                    className="mt-15 flex h-1/2 w-full max-w-6xl items-center justify-center bg-[url('/chapters/1/actC1_main.png')] bg-cover bg-center"
                    style={{ backgroundSize: "100% 100%" }}
                  >
                    <h1 className="text-with-stroke max-w-[80%] overflow-auto rounded-md p-10 text-center font-ogoby text-5xl">
                      {quizQuestions[questionNumber]?.quiz_question}
                    </h1>
                  </div>
                  <div className="text-with-stroke grid w-full grid-flow-row justify-items-center gap-x-0 gap-y-5 text-center font-ogoby text-3xl lg:grid-cols-2 ">
                    {/* options */}
                    <div
                      className={`flex h-[165px] w-[500px] transform items-center justify-center rounded-md bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center p-4 text-white transition-transform hover:cursor-pointer 
                      active:scale-75 
                      ${!isQuestionAnswered ? "" : ""}
                      ${
                        isQuestionAnswered &&
                        choice === quizQuestions[questionNumber].option_one &&
                        choice !==
                          quizQuestions[questionNumber][
                            `option_${quizQuestions[
                              questionNumber
                            ].correct_option.toLowerCase()}`
                          ]
                          ? "bg-red-500"
                          : ""
                      }
                    `}
                      onClick={() => {
                        handleChoice(quizQuestions[questionNumber]?.option_one);
                        setIsQuestionAnswered(true);
                        moveToNextQuestion(); // Move to the next question
                      }}
                      style={{ backgroundSize: "100% 100%" }}
                    >
                      <span className="p-10">
                        {quizQuestions[questionNumber]?.option_one}
                      </span>
                    </div>
                    <div
                      className={`flex h-[165px] w-[500px] transform items-center justify-center rounded-md bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center p-4 text-white transition-transform hover:cursor-pointer 
                      active:scale-75 
                      ${!isQuestionAnswered ? "" : ""}
                      ${
                        isQuestionAnswered &&
                        choice === quizQuestions[questionNumber].option_two &&
                        choice !==
                          quizQuestions[questionNumber][
                            `option_${quizQuestions[
                              questionNumber
                            ].correct_option.toLowerCase()}`
                          ]
                          ? "bg-red-500"
                          : ""
                      }
                    `}
                      onClick={() => {
                        handleChoice(quizQuestions[questionNumber]?.option_two);
                        setIsQuestionAnswered(true);
                        moveToNextQuestion(); // Move to the next question
                      }}
                      style={{ backgroundSize: "100% 100%" }}
                    >
                      <span className="p-10">
                        {quizQuestions[questionNumber]?.option_two}
                      </span>
                    </div>
                    <div
                      className={`flex h-[165px] w-[500px] transform items-center justify-center rounded-md bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center p-4 text-white transition-transform hover:cursor-pointer
                      active:scale-75 
                      ${!isQuestionAnswered ? "" : ""}
                      ${
                        isQuestionAnswered &&
                        choice === quizQuestions[questionNumber].option_three &&
                        choice !==
                          quizQuestions[questionNumber][
                            `option_${quizQuestions[
                              questionNumber
                            ].correct_option.toLowerCase()}`
                          ]
                          ? "bg-red-500"
                          : ""
                      }
                    `}
                      onClick={() => {
                        handleChoice(
                          quizQuestions[questionNumber]?.option_three
                        );
                        setIsQuestionAnswered(true);
                        moveToNextQuestion(); // Move to the next question
                      }}
                      style={{ backgroundSize: "100% 100%" }}
                    >
                      <span className="p-10">
                        {quizQuestions[questionNumber]?.option_three}
                      </span>
                    </div>
                    <div
                      className={`flex h-[165px] w-[500px] transform items-center justify-center rounded-md bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center p-4 text-white transition-transform hover:cursor-pointer 
                      active:scale-75 
                      ${!isQuestionAnswered ? "" : ""}
                      ${
                        isQuestionAnswered &&
                        choice === quizQuestions[questionNumber].option_four &&
                        choice !==
                          quizQuestions[questionNumber][
                            `option_${quizQuestions[
                              questionNumber
                            ].correct_option.toLowerCase()}`
                          ]
                          ? "bg-red-500"
                          : ""
                      }
                    `}
                      onClick={() => {
                        handleChoice(
                          quizQuestions[questionNumber]?.option_four
                        );
                        setIsQuestionAnswered(true);
                        moveToNextQuestion(); // Move to the next question
                      }}
                      style={{ backgroundSize: "100% 100%" }}
                    >
                      <span className="p-10">
                        {quizQuestions[questionNumber]?.option_four}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {flashBackground && (
                <div
                  className="absolute top-0 left-0 h-full w-full bg-red-500 bg-opacity-50" /* Adjust the background color */
                  style={{
                    animation: "flash 0.5s ease 1",
                  }} /* Adjust the animation duration */
                ></div>
              )}
            </div>
          ) : (
            <CompletionPage
              calculatedScore={calculatedScore}
              timeFinished={100 - timer}
              activityID={activityID}
              resetGame={handleRestartQuiz}
              stopGameOverMusic={() => stopGameOverMusic()}
            />
          )}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default Index;
