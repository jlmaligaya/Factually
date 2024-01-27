import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import Swipeable from "react-swipy";
import CompletionPage from "../../../../components/completion";
import LoadingScreen from "../../../../components/loading";
import Image from "next/image";
import ImageOverlay from "../../../../components/imageoverlay";
import LightsQuestions from "../../../../components/questionlights";

const Home = () => {
  // State variables
  const [cards, setCards] = useState([]);

  const [swipeDirection, setSwipeDirection] = useState(null);
  const [score, setScore] = useState(0);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [gameLength, setGameLength] = useState(0);
  const [isSwipingInProgress, setIsSwipingInProgress] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [initialVolume, setInitialVolume] = useState(0.5);
  const { data: session } = useSession();
  const router = useRouter();
  const userID = session ? session.user.uid : null;
  const activityID = router.query.activityID;
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(true);
  const [flashWrongBackground, setFlashWrongBackground] = useState(false);
  const [flashCorrectBackground, setFlashCorrectBackground] = useState(false);
  const [lives, setLives] = useState(5);
  const [timer, setTimer] = useState(110);
  const calculatedScore = Math.round((100 / gameLength) * score);
  const [loadingDone, setLoadingDone] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(
    Array(gameLength).fill(null)
  );
  const [questionTimer, setQuestionTimer] = useState(10); // Initial timer value in seconds
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

  useEffect(() => {
    // Set a timer for each question only after the countdown
    if (!showCountdown) {
      const questionInterval = setInterval(() => {
        setQuestionTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      // Handle the alert when the timer reaches 0
      if (questionTimer === 0) {
        showModal();
      }

      // Clear the interval when the component unmounts or the question changes
      return () => {
        clearInterval(questionInterval);
      };
    }
  }, [showCountdown, questionTimer]);

  // Audio references
  const backgroundMusicRef = useRef(null);
  const gameOverRef = useRef(null);
  const gameOver2Ref = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);

  // Stop game over music
  const stopGameOverMusic = () => {
    gameOverRef.current.pause();
    gameOver2Ref.current.pause();
  };

  // Add this function to shuffle the cards
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Fetches the questions from API only once
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (gameLength === 0 || isGameCompleted) {
          const result = await fetch(
            `../../../api/swiper?activityId=${activityID}`
          );
          const data = await result.json();
          const shuffledData = shuffleArray(data); // Shuffle the data
          setCards(shuffledData);
          setGameLength(data.length);
          setLoadingDone(true);
          console.log("Data: ", data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    console.log("Length: ", gameLength);
  }, [cards, gameLength, isGameCompleted, score]);

  // Countdown effect
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

  // Timer effect
  useEffect(() => {
    if (!showCountdown) {
      const timerInterval = setInterval(() => {
        if (timer === 0) {
          clearInterval(timerInterval);
        } else {
          setTimer((prevTimer) => prevTimer - 1);
        }
      }, 1000);

      if (isGameCompleted) {
        clearInterval(timerInterval);
      }

      return () => clearInterval(timerInterval);
    }
  }, [showCountdown, timer, isGameCompleted]);

  // Load and play background music
  useEffect(() => {
    backgroundMusicRef.current = new Audio("/sounds/actC2_bgm.ogg");
    backgroundMusicRef.current.volume = initialVolume;
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.play();

    gameOverRef.current = new Audio("/sounds/gameOver_bgm.ogg");
    gameOverRef.current.volume = initialVolume;
    gameOverRef.current.loop = false;

    gameOver2Ref.current = new Audio("/sounds/gameOver2_bgm.ogg");
    gameOver2Ref.current.volume = initialVolume;
    gameOver2Ref.current.loop = false;

    correctSoundRef.current = new Audio("/sounds/correct_sfx.wav");
    correctSoundRef.current.volume = initialVolume;
    correctSoundRef.current.loop = false;

    wrongSoundRef.current = new Audio("/sounds/wrong_sfx.wav");
    wrongSoundRef.current.volume = initialVolume;
    wrongSoundRef.current.loop = false;

    return () => {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;

      gameOverRef.current.pause();
      gameOverRef.current = null;

      gameOver2Ref.current.pause();
      gameOver2Ref.current = null;
    };
  }, [initialVolume]);

  // Helper function to remove a card
  const remove = () => setCards((prevCards) => prevCards.slice(1));

  // Handle swipe
  const handleSwipe = (direction) => {
    if (isSwiping) return;
    setIsSwiping(true);

    setSwipeDirection(direction);

    const currentCard = cards[0];
    const optionToCompare =
      direction === "left" ? currentCard.option_one : currentCard.option_two;

    if (optionToCompare === currentCard.correct_option) {
      setScore((prevScore) => prevScore + 1);
      correctSoundRef.current.play();
      correctSoundRef.current.currentTime = 0;
      setFlashCorrectBackground(true);
      setTimeout(() => {
        setFlashCorrectBackground(false);
      }, 500);
    } else {
      if (!wrongTopics.includes(currentCard.topic_name)) {
        setWrongTopics([...wrongTopics, currentCard.topic_name]);
      }
      console.log("List: ", wrongTopics);
      setFlashWrongBackground(true);
      setTimeout(() => {
        setFlashWrongBackground(false);
      }, 500);
      setLives((prevLives) => prevLives - 1);
      wrongSoundRef.current.play();
      wrongSoundRef.current.currentTime = 0;
    }
    const updatedCorrectAnswers = [...correctAnswers];
    updatedCorrectAnswers[cardIndex] =
      optionToCompare === currentCard.correct_option;
    setCorrectAnswers(updatedCorrectAnswers);
    setCardIndex(cardIndex + 1);
    setQuestionTimer(40);
    remove();

    if (cards.length === 1) {
      setIsGameCompleted(true);
    }

    setIsSwiping(false);
  };

  // Handle reject swipe
  const handleReject = () => {
    handleSwipe("left");
  };

  // Handle accept swipe
  const handleAccept = () => {
    handleSwipe("right");
  };

  // Handle end game conditions
  const handleEndGame = () => {
    if (lives === 0 || timer === 0 || isGameCompleted) {
      postScore(userID, activityID, calculatedScore, 110 - timer);
      backgroundMusicRef.current.pause();
      if (calculatedScore > 34) {
        gameOverRef.current.play();
      } else {
        gameOver2Ref.current.play();
      }
      setIsGameCompleted(true);
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

  useEffect(() => {
    handleEndGame();
  }, [lives, timer, isGameCompleted]);

  // Handle game restart
  const handleRestart = () => {
    gameOverRef.current.pause();
    gameOver2Ref.current.pause();
    backgroundMusicRef.current.play();
    gameOverRef.current.currentTime = 0;
    gameOver2Ref.current.currentTime = 0;
    backgroundMusicRef.current.currentTime = 0;
    setWrongTopics([]);
    setQuestionTimer(40);
    setCardIndex(0);
    setCorrectAnswers(Array(gameLength).fill(null));
    setCountdown(5);
    setShowCountdown(true);
    setTimer(110);
    setSwipeDirection(null);
    setScore(0);
    setLives(5);
    setIsGameCompleted(false);
    setIsOverlayVisible(false);
    setSelectedImage(null);
    setLoadingDone(false);
  };

  // Handle image click
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsOverlayVisible(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[url('/chapters/1/actC1_bg.jpg')]">
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
      {/* Loading Screen */}
      {!loadingDone && (
        <div className="flex h-screen w-full items-center justify-center bg-black font-ogoby text-4xl text-white">
          <LoadingScreen />
        </div>
      )}

      {/* Rest of your component */}
      {loadingDone && (
        <>
          {/* Countdown */}
          {showCountdown ? (
            <div
              className="text-with-stroke flex h-screen w-full items-center justify-center font-ogoby text-9xl text-white"
              style={{
                background: 'url("/chapters/1/actC1_bg.jpg")',
                backgroundSize: "cover",
              }}
            >
              {countdown === 0 ? <h1>GO!</h1> : <h1>{countdown}</h1>}
            </div>
          ) : !isGameCompleted ? (
            // Lives and Timer
            <div className="w-full">
              {/* Lives Section */}
              <div className="absolute top-10 flex w-full animate-bounce items-center gap-10 px-10">
                {[...Array(lives)].map((_, i) => (
                  <div key={i} className="relative h-6 w-6">
                    {i < lives ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="red"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="black"
                        className="h-16 w-16"
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
                        className="h-16 w-16"
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
                  questionCount={gameLength}
                  correctAnswers={correctAnswers}
                  currentQuestionIndex={cardIndex}
                />
              </div>

              {/* Timer Section */}
              <div
                className="absolute top-0 left-0 h-5 bg-red-500"
                style={{ width: `${(timer / 110) * 100}%` }}
              ></div>
            </div>
          ) : null}

          {/* Cards */}
          {!isGameCompleted && (
            <div>
              <div className="text-with-stroke mb-4 flex h-[150px] w-[815px] items-center justify-center rounded-md border-4 border-gray-600 bg-slate-500 text-center font-ogoby text-4xl shadow-md">
                Drag the card left if it&apos;s {cards[0]?.option_one} otherwise
                swipe right if {cards[0]?.option_two}.
              </div>
              <div className="flex flex-row">
                <button
                  onClick={handleReject}
                  className="text-with-stroke mr-2 h-[600px] w-[150px] select-none rounded-tr-xl rounded-bl-xl border-4 border-red-600  bg-red-500 px-4 py-2 font-ogoby text-4xl text-white opacity-90 shadow-md"
                >
                  {cards[0]?.option_one} <br />
                  &lt;&lt;
                </button>
                <div className={`relative animate-${swipeDirection}`}>
                  <Swipeable onSwipe={handleSwipe}>
                    <div className=" flex h-[600px] w-[500px] select-none flex-col items-center justify-center bg-white shadow-md">
                      <div className="group relative flex h-4/5 w-full select-none items-center justify-center">
                        <Image
                          src={cards[0]?.imageUrl}
                          alt={`Article Image: ${cards[0]?.id}`}
                          height={200}
                          width={200}
                          className="text-with-stroke h-4/5 w-4/5 transform select-none rounded-lg border-4 border-gray-500 bg-white font-ogoby text-white transition-transform group-hover:scale-105"
                          draggable="false"
                          priority
                          onClick={() => handleImageClick(cards[0]?.imageUrl)}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                            onClick={() => handleImageClick(cards[0]?.imageUrl)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="h-6 w-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <h1 className="w-1/2 rounded-md bg-slate-300 p-3 text-center font-ogoby text-black">
                        {cards[0]?.description}
                      </h1>
                    </div>
                  </Swipeable>
                </div>
                <button
                  onClick={handleAccept}
                  className="text-with-stroke ml-2 h-[600px] w-[150px] select-none rounded-tl-xl rounded-br-xl border-4 border-green-600 bg-green-500 px-4 py-2 font-ogoby text-4xl text-white opacity-90 shadow-md"
                >
                  {cards[0]?.option_two} <br />
                  &gt;&gt;
                </button>
              </div>
            </div>
          )}

          {/* Game Over */}
          {isGameCompleted && (
            <CompletionPage
              activityID={activityID}
              calculatedScore={calculatedScore}
              timeFinished={110 - timer}
              stopGameOverMusic={stopGameOverMusic}
              wrongTopics={wrongTopics}
              resetGame={handleRestart}
            />
          )}

          {/* Image Overlay */}
          {isOverlayVisible && (
            <ImageOverlay
              imageUrl={selectedImage}
              onClose={() => setIsOverlayVisible(false)}
            />
          )}

          {/* Flash Background */}
          {flashWrongBackground && (
            <div
              className="absolute top-0 left-0 h-full w-full bg-red-500 bg-opacity-50"
              style={{ animation: "flash-wrong 0.5s ease 1" }}
            ></div>
          )}
          {flashCorrectBackground && (
            <div
              className="absolute top-0 left-0 h-full w-full bg-green-500 bg-opacity-50"
              style={{ animation: "flash-correct 0.5s ease 1" }}
            ></div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
