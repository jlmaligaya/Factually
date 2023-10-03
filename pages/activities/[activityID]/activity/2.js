import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import axios from "axios";
import LoadingScreen from '../../../../components/loading';
import CompletionPage from '../../../../components/completion';

const CaptchaGame = () => {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();
  const userID = session ? session.user.uid : null;
  const activityID = router.query.activityID;
  const [gameData, setGameData] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [verificationState, setVerificationState] = useState('idle'); // 'idle', 'correct', or 'incorrect'
  const [currentGameStateIndex, setCurrentGameStateIndex] = useState(0); // Default to the first game state
  const maxSelections = 3;
  const [lives, setLives] = useState(5);
  const [timer, setTimer] = useState(60);
  const [gameDataLength, setGameDataLength] = useState(0)
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [loadingDone, setLoadingDone] = useState(false);
  const calculatedScore = Math.round((100 / gameDataLength) * totalScore);
  const backgroundMusicRef = useRef(null);
  const gameOverRef = useRef(null)
  const gameOver2Ref = useRef(null)
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
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown < 0) {
      setShowCountdown(false); // Hide the countdown when it reaches zero
    }

    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    // Set the volume value in localStorage when it changes
    const savedBgmVolume = parseFloat(localStorage.getItem('bgmVolume'));
    if (!isNaN(savedBgmVolume)){
      setInitialVolume(savedBgmVolume);
    }
  }, [initialVolume]);
 
  useEffect(() => {
    // Load and play background music when the component mounts
    backgroundMusicRef.current = new Audio('/sounds/actC1_bgm.ogg');
    backgroundMusicRef.current.volume = initialVolume; // Set the initial volume as needed
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.play();

    gameOverRef.current = new Audio('/sounds/gameOver_bgm.ogg');
    gameOverRef.current.volume = initialVolume; // Set the initial volume as needed
    gameOverRef.current.loop = false;

    gameOver2Ref.current = new Audio('/sounds/gameOver2_bgm.ogg');
    gameOver2Ref.current.volume = initialVolume; // Set the initial volume as needed
    gameOver2Ref.current.loop = false;

    correctSoundRef.current = new Audio('/sounds/correct_sfx.wav');
    correctSoundRef.current.volume = initialVolume; // Set the initial volume as needed
    correctSoundRef.current.loop = false;

    wrongSoundRef.current = new Audio('/sounds/wrong_sfx.wav');
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
        const result = await fetch(`../../../api/imagematch?activityId=${activityID}`);
        if (result.ok) {
          const data = await result.json();
          console.log('Fetched game data:', data); 
          setGameData(data);
          setGameDataLength(data.length)
          setLoadingDone(true); 
        } else {
          console.error('Failed to fetch game data');
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
    if (verificationState === 'correct') {
      // If verification is correct, preload images for the next game state and reset the state
      preloadNextGameStateImages();
      setSelectedImages([]);
      setTimeout(() => {
        switchGameState();
        setVerificationState('idle');
      }, 1000);
    } else if (verificationState === 'incorrect') {
      // If verification is incorrect, reset the state after a delay (e.g., 2 seconds)
      setFlashBackground(true)
      setTimeout(() => {
        setFlashBackground(false);
      }, 500); // Adjust the duration to match the animation duration in CSS
      const timeoutId = setTimeout(() => {
        setSelectedImages([]);
        setVerificationState('idle');
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [verificationState, currentGameStateIndex]);


  const currentGameState = gameData?.[currentGameStateIndex];

  const handleImageClick = (image) => {
    if (verificationState === 'correct') {
      return; // Prevent further selection after verification
    }

    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((selected) => selected !== image));
    } else if (selectedImages.length < maxSelections) {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const isImageSelected = (image) => selectedImages.includes(image);

  const checkWinCondition = () => {
    const correctSelections = selectedImages.filter((image) =>
      currentGameState?.images?.filter((img) => img.value === true).map((img) => img.url).includes(image)
    );
    return correctSelections.length >= maxSelections;
  };
  
  const switchGameState = () => {
    // Check if all game states have been completed
    if (currentGameStateIndex >= gameData?.length - 1) {
      // All game states have been completed
      setGameCompleted(true);
    } else {
      // Increment the current game state index
      setCurrentGameStateIndex((prevIndex) => prevIndex + 1);
    }
  };
  
  const verifyImages = () => {
    
    if (checkWinCondition()) {
      setVerificationState('correct');
      // Increment the score when verification is correct
      setTotalScore(totalScore + increment);
      // Reset incorrect attempts when the user is correct
      setIncrement(1)
      setIncorrectAttempts(0);
      correctSoundRef.current.play();
      correctSoundRef.current.currentTime = 0;

    } else {
      if (incorrectAttempts == 2) {
        // If the user has tried 3 times, proceed to the next set of pictures
        setVerificationState('incorrect');
        switchGameState();
        setIncorrectAttempts(0); // Reset incorrect attempts
        setIncrement(1)
        wrongSoundRef.current.play();
        wrongSoundRef.current.currentTime = 0;
      } else {
        setIncorrectAttempts(incorrectAttempts + 1);
        setIncrement(increment - 0.3333333333)
        console.log("Add points: ", increment)
        setVerificationState('incorrect');
        wrongSoundRef.current.play();
        wrongSoundRef.current.currentTime = 0;
      }
      setLives(lives - 1);
    }
  };

  const preloadNextGameStateImages = () => {
    const nextGameState = gameData?.[(currentGameStateIndex + 1) % (gameData?.length || 1)];
    nextGameState?.images?.forEach((image) => {
      const img = new Image();
      img.src = image.url;
    });
  };

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
        if (calculatedScore > 34){
          gameOverRef.current.play();
        }
        else{
          gameOver2Ref.current.play();
        }
      setGameCompleted(true)
      postScore(userID, activityID, calculatedScore, 60 - timer);
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
    setCountdown(5)
    setShowCountdown(true)
    setGameCompleted(false);
    setLives(5);
    setTimer(60);
    setCurrentGameStateIndex(0);
    setSelectedImages([]);
    setTotalScore(0)
    setVerificationState('idle');
  };

  const gameContent = (
    <div className={`h-screen w-full flex flex-col gap-4 justify-center items-center ${verificationState === 'correct' ? 'bg-green-100' : 'bg-[url("/chapters/1/actC1_bg.jpg")]'}`} style={{ backgroundSize: '100% 100%' }}>
      <div className="flex gap-10 items-center  px-10 w-full">
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

      <div className='bg-slate-500 h-1/6 w-1/2 font-ogoby text-4xl text-with-stroke flex items-center justify-center text-center border-4 border-gray-600 rounded-md'>Verify all the images based on the requirement.</div>
      <div className={`bg-white flex flex-col p-10 rounded-lg border-4 ${verificationState === 'correct' ? 'border-green-500' : verificationState === 'incorrect' ? 'border-red-500' : 'border-slate-500'}`}>
        <h2 className="text-5xl font-ogoby text-with-stroke mb-4 text-black text-center bg-red-100 p-5 rounded-full border-red-300 border-4">
          {currentGameState?.title.toUpperCase()}
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {currentGameState?.images?.map((image) => (
            <div
              key={image.id}
              className={`cursor-pointer ${
                isImageSelected(image.url)
                  ? 'border-4 border-green-500'
                  : 'border-4 border-gray-300'
              } ${
                selectedImages.length >= maxSelections && !isImageSelected(image.url)
                  ? 'opacity-50 pointer-events-none'
                  : ''
              } ${
                verificationState === 'incorrect' &&
                currentGameState?.images
                  ?.filter((img) => img.value === true)
                  .map((img) => img.url)
                  .includes(image.url)
                  ? 'border border-red-500'
                  : ''
              }`}
              onClick={() => handleImageClick(image.url)}
            >
              <img src={image.url} alt={`Captcha ${image.id}`} className="w-full h-auto pointer-events-none" />
            </div>
          ))}
        </div>
        <button
          onClick={verifyImages}
          className={`flex justify-center mt-4 px-4 py-2 ${
            verificationState === 'correct'
              ? 'bg-green-500 text-white'
              : verificationState === 'incorrect'
              ? 'bg-red-500 text-white'
              : 'bg-slate-500 text-white'
          } rounded hover:bg-red-600 ${
            selectedImages.length === maxSelections ? '' : 'opacity-50 pointer-events-none'
          }`}
          disabled={verificationState === 'incorrect' || verificationState === 'correct'}
        >
          {verificationState === 'correct' ? (
            'Verified'
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );


  useEffect(() => {
    handleEndGame();
  }, [lives, timer, gameCompleted]);

  return (
    <div className="h-screen w-full flex flex-col gap-4 justify-center items-center">
      {!loadingDone ? (
        <LoadingScreen /> // Render loading screen while data is being fetched
      ) :
      showCountdown ? ( // Render the countdown overlay if showCountdown is true
      <div className="h-screen w-full flex justify-center items-center font-ogoby text-9xl">
         {countdown === 0 ? (
          <h1>GO!</h1>
        ) : (
          <h1>{countdown}</h1>
        )}
      </div>
    ) : gameCompleted ? (
        <CompletionPage calculatedScore={calculatedScore} timeFinished={60 - timer} resetGame={resetGame} stopGameOverMusic={() => stopGameOverMusic()} />
      ) : (
        gameContent
      )}
      {flashBackground && (
          <div
            className="h-full w-full absolute top-0 left-0 bg-red-500 bg-opacity-50" /* Adjust the background color */
            style={{ animation: 'flash 0.5s ease 1' }} /* Adjust the animation duration */
          ></div>
        )}
    </div>
  );
};

export default CaptchaGame;