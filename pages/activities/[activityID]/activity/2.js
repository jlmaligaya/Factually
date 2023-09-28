import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";

const CaptchaGame = () => {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  const activityID = router.query.activityID;
  const [gameData, setGameData] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [verificationState, setVerificationState] = useState('idle'); // 'idle', 'correct', or 'incorrect'
  const [currentGameStateIndex, setCurrentGameStateIndex] = useState(0); // Default to the first game state
  const maxSelections = 3;

  // Your existing useEffect for fetchGameData
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const result = await fetch(`../../../api/imagematch?activityId=${activityID}`);
        if (result.ok) {
          const data = await result.json();
          console.log('Fetched game data:', data); 
          setGameData(data);
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
      }, 2000);
    } else if (verificationState === 'incorrect') {
      // If verification is incorrect, reset the state after a delay (e.g., 2 seconds)
      const timeoutId = setTimeout(() => {
        setSelectedImages([]);
        setVerificationState('idle');
      }, 2000);
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
      setTotalScore((prevScore) => prevScore + 1);
    } else {
      setVerificationState('incorrect');
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
  

  const resetGame = () => {
    setGameCompleted(false);
    setCurrentGameStateIndex(0);
    setSelectedImages([]);
    setTotalScore(0)
    setVerificationState('idle');
  };

  const gameContent = (
    <div className={`h-screen w-full flex flex-col gap-4 justify-center items-center ${verificationState === 'correct' ? 'bg-green-100' : 'bg-[url("/chapters/1/actC1_bg.jpg")]'}`}>
      <div className='bg-slate-500 h-1/6 w-1/2 font-boom text-3xl flex items-center justify-center'>Select all the right pictures.</div>
      <div className={`bg-white flex flex-col p-10 rounded-lg border-4 ${verificationState === 'correct' ? 'border-green-500' : verificationState === 'incorrect' ? 'border-red-500' : 'border-slate-500'}`}>
        <h2 className="text-xl font-semibold mb-4 font-boom text-black text-center bg-red-100 p-5 rounded-full border-red-300 border-4">
          {currentGameState?.title}
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

  const completionPage = (
    <div className="w-1/2 h-1/2 border-8 rounded-xl bg-white flex flex-col justify-center items-center font-medium gap-8 p-8 shadow-lg">
      <div className="w-full text-center">
        <h1 className="text-4xl font-boom text-red-700 mb-2 text-with-stroke">Quiz Summary</h1>
        <hr className="border-red-500 w-16 mx-auto mb-4" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full flex flex-col justify-center items-center border-b-2 border-red-500 pb-4">
          <h2 className="text-4xl font-ogoby text-with-stroke mb-4">Your score</h2>
          <h2 className="text-6xl font-ogoby text-with-stroke mb-4">{totalScore}</h2>
        </div>

        {/* Stars */}
        <div className="flex items-center">
          {[1, 2, 3].map((star, index) => (
            <div
              key={star}
              className={`w-16 h-16 ${
                totalScore >= index + 1 ? 'fadeIn' : 'hidden'
              } transition-opacity duration-1000`}
            >
              {/* Insert your star SVG or image here */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="yellow"
                viewBox="0 0 24 24"
                stroke-width="1"
                stroke="black"
                className="w-100 h-100"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.040.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-center gap-4 pt-4">
          <button
            className="bg-red-500 hover:bg-red-600 flex justify-center items-center text-white font-boom rounded-md p-3"
            onClick={resetGame}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 flex justify-center items-center text-white font-boom rounded-md p-3"
            onClick={() => router.push('/')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col gap-4 justify-center items-center">
      {gameCompleted ? completionPage : gameContent}
    </div>
  );
};

export default CaptchaGame;