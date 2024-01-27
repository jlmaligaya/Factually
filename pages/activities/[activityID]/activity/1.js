import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingScreen from "../../../../components/loading";
import CompletionPage from "../../../../components/completion";
import LightsQuestions from "../../../../components/QuestionLights";
import Head from "next/head";
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
  const [flashWrongBackground, setFlashWrongBackground] = useState(false);
  const [flashCorrectBackground, setFlashCorrectBackground] = useState(false);
  const [timeGained, setTimeGained] = useState(0);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(20); // Initial timer value in seconds
  const [correctAnswers, setCorrectAnswers] = useState(
    Array(questionLength).fill(null)
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
          // Shuffle questions and options
          setQuizQuestions(shuffleArray(data));
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

  useEffect(() => {
    // Timer Effect
    if (!showCountdown) {
      // Start the timer when showCountdown becomes false (after "GO!" is displayed)
      const timerInterval = setInterval(() => {
        if (timer + timeGained === 0) {
          // Handle timer reaching zero
          clearInterval(timerInterval);
        } else {
          setTimer((prevTimer) => {
            const newTime = prevTimer - 1;
            return newTime >= 0 ? newTime : 0;
          });
          // Check if time is gained and trigger the green flash
        }
      }, 1000);

      // Clear the timer interval when the quiz ends
      if (quizEnded) {
        clearInterval(timerInterval);
      }

      return () => clearInterval(timerInterval);
    }
  }, [showCountdown, timer, quizEnded, timeGained]);

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
      setTimer((prevTimer) => {
        const newTime = prevTimer + 3; // Add 3 seconds to the timer
        return newTime <= 100 ? newTime : 100; // Ensure the timer does not exceed the original time
      });
      correctSoundRef.current.play();
      correctSoundRef.current.currentTime = 0;
      setTimeGained(3); // Update the time gained state
      // Trigger the flash animation
      setFlashCorrectBackground(true);
      setTimeout(() => {
        setFlashCorrectBackground(false);
      }, 500); // Adjust the duration to match the animation duration in CSS
    } else if (
      choice !== quizQuestions[questionNumber]?.correct_option &&
      !isQuestionAnswered
    ) {
      setIsQuestionAnswered(true);
      // Add the topic to the wrongTopics list if it's not already present
      if (!wrongTopics.includes(quizQuestions[questionNumber]?.topic_name)) {
        setWrongTopics([
          ...wrongTopics,
          quizQuestions[questionNumber]?.topic_name,
        ]);
      }
      setLostLives([...lostLives, lives - 1]);
      setLives(lives - 1);
      wrongSoundRef.current.play();
      wrongSoundRef.current.currentTime = 0;
      console.log(wrongTopics);
      console.log(quizQuestions[questionNumber]);
      // Trigger the flash animation
      setFlashWrongBackground(true);
      setTimeout(() => {
        setFlashWrongBackground(false);
      }, 500); // Adjust the duration to match the animation duration in CSS
    } else {
      alert("You have already answered this question");
    }
    const updatedCorrectAnswers = [...correctAnswers];
    updatedCorrectAnswers[questionNumber] =
      choice === quizQuestions[questionNumber]?.correct_option;
    setCorrectAnswers(updatedCorrectAnswers);

    setChoice(choice);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];

      // Update correct_option index if it exists
      if (array[i].options && array[i].correct_option !== undefined) {
        array[i].correct_option = array[i].options.indexOf(
          array[i].correct_option
        );
      }
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

    setCorrectAnswers(Array(questionLength).fill(null));
    setWrongTopics([]);
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
    // Reset the timer and alert flag
    setQuestionTimer(30);
    setAlertTriggered(false);

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

  useEffect(() => {
    // Set a timer for each question
    const questionInterval = setInterval(() => {
      setQuestionTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Handle the alert when the timer reaches 0
    if (questionTimer === 0 && !alertTriggered) {
      showModal();
      setAlertTriggered(true);
    }

    // Clear the interval when the component unmounts or the question changes
    return () => {
      clearInterval(questionInterval);
    };
  }, [questionTimer, alertTriggered, moveToNextQuestion]);

  return (
    <>
      <Head>
        <title>MCQ</title>
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
                className=" mr-2 rounded-lg bg-red-500 px-4 py-2 text-white"
                onClick={closeModal}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
      {flashCorrectBackground && (
        <div className="fixed inset-0 flex h-full w-full items-center justify-center">
          {" "}
          <p className="text-with-stroke animate-ping-slow justify-end p-10 font-ogoby text-8xl text-yellow-400">
            +3s
          </p>
        </div>
      )}
      {showCountdown && loadingDone ? ( // Render the countdown overlay if showCountdown is true
        <div
          className="text-with-stroke flex h-screen w-full items-center justify-center font-ogoby text-9xl text-white"
          style={{
            background: 'url("/chapters/1/actC1_bg.jpg")',
            backgroundSize: "cover",
          }}
        >
          {countdown === 0 ? <h1>GO!</h1> : <h1>{countdown}</h1>}
        </div>
      ) : quizQuestions?.length > 0 && loadingDone ? (
        <div className="flex h-screen w-full items-center justify-center bg-[url('/chapters/1/actC1_bg.jpg')]">
          {!quizEnded ? (
            <div className="flex h-screen w-full items-center justify-center">
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-16 bg-[url('/chapters/1/actC1_bg.jpg')] bg-cover bg-center font-medium text-white"
                style={{ backgroundSize: "100% 100%" }}
              >
                <div className="absolute top-0 flex w-full justify-between px-10">
                  {/* lives */}
                  <div className="mt-10 flex animate-bounce items-center gap-4">
                    {[...Array(lives)].map((_, i) => (
                      <div key={i} className="relative mr-2 h-10">
                        {lostLives.includes(i) ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="red"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="black"
                            className="h-20 w-20"
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
                            className="h-20 w-16"
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
                  <div className="absolute top-10 right-4">
                    {" "}
                    <LightsQuestions
                      questionCount={questionLength}
                      correctAnswers={correctAnswers}
                      currentQuestionIndex={questionNumber}
                    />
                  </div>

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
                  <div className="text-stroke-choice grid w-full grid-flow-row justify-items-center gap-x-0 gap-y-5 text-center font-ogoby text-3xl lg:grid-cols-2 ">
                    {/* options */}
                    <div
                      className={`flex h-[165px] w-[500px] transform items-center justify-center rounded-md bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center p-4 text-yellow-300 transition-transform hover:cursor-pointer 
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
                      className={`flex h-[165px] w-[500px] transform items-center justify-center rounded-md bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center p-4 text-yellow-300 transition-transform hover:cursor-pointer 
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
                      className={`flex h-[165px] w-[500px] transform items-center justify-center rounded-md bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center p-4 text-yellow-300 transition-transform hover:cursor-pointer
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
                      className={`flex h-[165px] w-[500px] transform items-center justify-center rounded-md bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center p-4 text-yellow-300 transition-transform hover:cursor-pointer 
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
              {flashWrongBackground && (
                <div
                  className="absolute top-0 left-0 h-full w-full bg-red-500 bg-opacity-50" /* Adjust the background color */
                  style={{
                    animation: "flash-wrong 0.5s ease 1",
                  }} /* Adjust the animation duration */
                ></div>
              )}
              {flashCorrectBackground && (
                <div
                  className="absolute top-0 left-0 h-full w-full bg-green-500 bg-opacity-50" /* Adjust the background color */
                  style={{
                    animation: "flash-correct 0.5s ease 1",
                  }} /* Adjust the animation duration */
                ></div>
              )}
            </div>
          ) : (
            <CompletionPage
              activityID={activityID}
              calculatedScore={calculatedScore}
              timeFinished={100 - timer}
              resetGame={handleRestartQuiz}
              stopGameOverMusic={() => stopGameOverMusic()}
              wrongTopics={wrongTopics}
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
