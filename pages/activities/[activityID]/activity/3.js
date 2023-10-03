import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import axios from "axios";
import Swipeable from "react-swipy";
import CompletionPage from "../../../../components/completion";


const placeHolder = [
    { id: 1, value: true, imageUrl: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?cs=srgb&dl=pexels-pixabay-267350.jpg&fm=jpg" },
    { id: 2, value: false, imageUrl: "https://robertkatai.com/wp-content/uploads/2018/05/wsi-imageoptim-image-1-1.jpg" },
    { id: 3, value: true, imageUrl: "https://commondenominator.email/wp-content/uploads/2017/08/how-to-optimize-for-googles-featured-snippets-to-build-more-traffic-16.png" },
];

const Home = () => {
  // State variables
  const [cards, setCards] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [score, setScore] = useState(0);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [gameLength, setGameLength] = useState(0);
  const [calculatedScore, setCalculatedScore] = useState(0);
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
  const [flashBackground, setFlashBackground] = useState(false);
  const [lives, setLives] = useState(5);
  const [timer, setTimer] = useState(60);

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

  useEffect(() => {
    if (gameLength === 0) {
      setCards(placeHolder);
      setGameLength(placeHolder.length);
    }

    setCalculatedScore(Math.round((100 / gameLength) * score));
  }, [cards, gameLength, isGameCompleted, score]);


  // Countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown < 0) {
      setShowCountdown(false);
    }

    return () => clearInterval(interval);
  }, [countdown]);

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
    backgroundMusicRef.current = new Audio('/sounds/actC1_bgm.ogg');
    backgroundMusicRef.current.volume = initialVolume;
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.play();

    gameOverRef.current = new Audio('/sounds/gameOver_bgm.ogg');
    gameOverRef.current.volume = initialVolume;
    gameOverRef.current.loop = false;

    gameOver2Ref.current = new Audio('/sounds/gameOver2_bgm.ogg');
    gameOver2Ref.current.volume = initialVolume;
    gameOver2Ref.current.loop = false;

    correctSoundRef.current = new Audio('/sounds/correct_sfx.wav');
    correctSoundRef.current.volume = initialVolume;
    correctSoundRef.current.loop = false;

    wrongSoundRef.current = new Audio('/sounds/wrong_sfx.wav');
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
    if (
      (direction === "right" && currentCard.value === true) ||
      (direction === "left" && currentCard.value === false)
    ) {
      setScore((prevScore) => prevScore + 1);
      correctSoundRef.current.play();
      correctSoundRef.current.currentTime = 0;
    } else {
      setFlashBackground(true);
      setTimeout(() => {
        setFlashBackground(false);
      }, 500);
      setLives((prevLives) => prevLives - 1);
      wrongSoundRef.current.play();
      wrongSoundRef.current.currentTime = 0;
    }

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
      postScore(userID, activityID, calculatedScore, 60 - timer);
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
    setCountdown(5);
    setShowCountdown(true);
    setTimer(60);
    setCards(placeHolder);
    setSwipeDirection(null);
    setScore(0);
    setLives(5);
    setIsGameCompleted(false);
    setGameLength(placeHolder.length);
    setCalculatedScore(0);
    setIsOverlayVisible(false);
    setSelectedImage(null);
  };

  // Handle image click
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsOverlayVisible(true);
  };


  return (
    <div className="min-h-screen bg-[url('/chapters/1/actC1_bg.jpg')] flex flex-col items-center justify-center overflow-hidden">
      {/* Countdown */}
      {showCountdown ? (
        <div className="h-screen w-full flex justify-center items-center font-ogoby text-9xl bg-black">
          {countdown === 0 ? (
            <h1>GO!</h1>
          ) : (
            <h1>{countdown}</h1>
          )}
        </div>
      ) : !isGameCompleted ? (
        // Lives and Timer
        <div className="w-full">
          <div className="flex gap-10 items-center px-10 w-full absolute top-10">
            {[...Array(lives)].map((_, i) => (
              <div key={i} className="h-6 w-6 relative">
                {i < lives ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 h-5 bg-red-500" style={{ width: `${(timer / 60) * 100}%` }}></div>
        </div>
      ) : null}
      
      {/* Cards */}
      {!isGameCompleted && (
        <div>
          <div className='bg-slate-500 h-[150px] w-[815px] font-ogoby text-4xl text-with-stroke flex items-center justify-center text-center border-4 border-gray-600 rounded-md mb-4'>Swipe the card right if fact otherwise left.</div>
          <div className="flex flex-row">
          <button
            onClick={handleReject}
            className="bg-red-500 text-white w-[150px] h-[600px] px-4 py-2 font-ogoby text-4xl rounded-lg mr-2 text-with-stroke"
          >
            FAKE <br />&lt;&lt;
          </button>
          <div className={`relative animate-${swipeDirection}`}>
            <Swipeable onSwipe={handleSwipe}>
              <div className="bg-white w-[500px] h-[600px] flex justify-center select-none">
                <img
                  src={cards[0]?.imageUrl}
                  alt={`${cards[0]?.value}`}
                  className="bg-white m-5 rounded-lg w-full h-1/2 select-none border-gray-500 border-4 text-white text-with-stroke font-ogoby text-6xl"
                  draggable="false"
                  onClick={() => handleImageClick(cards[0]?.imageUrl)}
                />
              </div>
            </Swipeable>
          </div>
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white w-[150px] h-[600px] font-ogoby text-4xl text-with-stroke px-4 py-2 rounded-lg ml-2"
          >
            FACT <br />&gt;&gt;
          </button>
        </div>
        </div>

      )}

      {/* Game Over */}
      {isGameCompleted && (
        <CompletionPage
          calculatedScore={calculatedScore}
          timeFinished={60 - timer}
          stopGameOverMusic={stopGameOverMusic}
          resetGame={handleRestart}
        />
      )}

      {/* Image Overlay */}
      {isOverlayVisible && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-75 z-50 flex justify-center items-center"
          onClick={() => setIsOverlayVisible(false)}
        >
          <img
            src={selectedImage}
            alt="Selected"
            className="max-h-full max-w-full"
          />
        </div>
      )}

      {/* Flash Background */}
      {flashBackground && (
        <div
          className="h-full w-full absolute top-0 left-0 bg-red-500 bg-opacity-50"
          style={{ animation: 'flash 0.5s ease 1' }}
        ></div>
      )}
    </div>
  );
};

export default Home;