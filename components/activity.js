import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/router'
import Confetti from 'react-confetti'
import { useSession } from 'next-auth/react';

const Index = () => {
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [questionLength, setQuestionLength] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timer, setTimer] = useState(60);
  const [retries, setRetries] = useState(0);
  const [lostLives, setLostLives] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const [choice, setChoice] = useState(null); // Declare choice state variable
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const {data: session, status} = useSession();
  const userID = session.user.uid;
  const activityID = router.query.activityID;

  // Fetches the questions from API
  useEffect(() => {
    const fetchData = async () => {
      const activityID = router.query.activityID;
      try {
        const result = await fetch(`/api/questions?activityId=${activityID}`);
        const data = await result.json();
        setQuizQuestions(data);
        setQuestionLength(data.length);
        
       
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [router.query.activityID]);
  console.log("1:", quizQuestions)
  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer => timer - 1);
    }, 1000);

    if (quizEnded) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [quizEnded]);

  const postScore = async (uid, aid, score, retries, timeLeft, livesLeft) => {
    try {
      const response = await axios.post("/api/scores", {
        uid,
        aid,
        score,
        retries,
        timeLeft,
        livesLeft,
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleChoice = (choice) => {
    if (choice === quizQuestions[questionNumber]?.correct_option && !isQuestionAnswered) {
      setIsQuestionAnswered(true);
      setTotalScore(totalScore + 1);
    } else if (choice !== quizQuestions[questionNumber]?.correct_option && !isQuestionAnswered) {
      setIsQuestionAnswered(true);
      setLostLives([...lostLives, lives - 1]); // add the index of the heart that corresponds to the current lives count
      setLives(lives - 1);
    }
    else{
      alert("You have already answered this question");
    }
    setChoice(choice); // Set choice state variable to the selected choice
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleEndQuiz = () => {
    if (lives === 0){
      setShowModal(true);
      setLives(5);
      setTimer(60);
      setQuizEnded(true);
      postScore(userID, activityID, totalScore, retries, 60 - timer, 5 - lives);
    } 
    else if (timer === 0) {
      setShowModal(true);
      setLives(5);
      setTimer(60);
      setQuizEnded(true);
      postScore(userID, activityID, totalScore, retries, 60 - timer, 5 - lives);
    }
    else {
      postScore(userID, activityID, totalScore, retries, 60 - timer, 5 - lives);
    }
  };

  const handleRestartQuiz = () => {
    setLives(5);
    setTimer(60);
    setQuestionNumber(0);
    setQuizEnded(false);
    setIsQuestionAnswered(false);
    setTotalScore(0);
    setRetries(retries + 1);
    setQuizQuestions(shuffleArray(quizQuestions));
    setChoice(null); // Reset choice state variable to null
    setLostLives([]);
  };

  useEffect(() => {
    handleEndQuiz();
  }, [lives, timer]);

  return (
    <>
      {showModal && (
        // Modal for Game Over
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="bg-red-500 rounded-t-lg px-4 py-2 flex items-center justify-center">
              <svg className="h-8 w-8 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h3 className="text-white font-bold">Game Over!</h3>
            </div>
            <div className="p-4">
              <div className="text-center">
                <p className="text-gray-700 mb-2">Better luck next time!</p>
                <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded" onClick={() => setShowModal(false)}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quizQuestions.length > 0 ? (
        // Render the activity when quizQuestions has data
        <div className="h-screen w-full flex justify-center items-center">
          {!quizEnded ? (
            // Quiz in progress
            <div className="h-screen w-full flex justify-center items-center">
              <div className="h-full w-full bg-white flex flex-col justify-center items-center text-black font-medium gap-16">
                <div className="flex justify-between w-full px-10 py-4">
                  <div className="flex items-center">
                    {[...Array(lives)].map((_, i) => (
                      <div key={i} className="text-red-500 h-6 w-6 mr-2 relative">
                        {lostLives.includes(i) && (
                          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                            <div className="animate-spin">♥</div>
                          </div>
                        )}
                        {!lostLives.includes(i) && '♥'}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-xl">{timer} sec</span>
                    <div className="h-6 w-6 flex justify-center items-center">
                      <span className="text-white">⏲️</span>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-4xl border-solid border-4 flex justify-center">
                  <h1 className="text-2xl p-10 rounded-md">{quizQuestions[questionNumber]?.quiz_question}</h1>
                </div>
                <div className="grid grid-cols-2 gap-8 gap-x-12">
                  {/* options */}
                  <div 
                    className={`w-[400px] rounded-md flex justify-center items-center p-4 text-white transform active:scale-75 transition-transform 
                      hover:cursor-pointer 
                      ${!isQuestionAnswered ? 'bg-blue-400 hover:bg-blue-600' : ''}
                      ${isQuestionAnswered && quizQuestions[questionNumber].correct_option === quizQuestions[questionNumber].option_one ? 'bg-green-500' : ''}
                      ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_one && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}
                    `}
                    onClick={() => handleChoice(quizQuestions[questionNumber]?.option_one)}
                  >
                    {quizQuestions[questionNumber]?.option_one}
                  </div>
                  <div 
                    className={`w-[400px] rounded-md flex justify-center items-center p-4 text-white transform active:scale-75 transition-transform 
                      hover:cursor-pointer 
                      ${!isQuestionAnswered ? 'bg-blue-400 hover:bg-blue-600' : ''}
                      ${isQuestionAnswered && quizQuestions[questionNumber].correct_option === quizQuestions[questionNumber].option_two ? 'bg-green-500' : ''}
                      ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_two && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}
                    `}
                    onClick={() => handleChoice(quizQuestions[questionNumber]?.option_two)}
                  >
                    {quizQuestions[questionNumber]?.option_two}
                  </div>
                  <div 
                    className={`w-[400px] rounded-md flex justify-center items-center p-4 text-white transform active:scale-75 transition-transform
                      hover:cursor-pointer 
                      ${!isQuestionAnswered ? 'bg-blue-400 hover:bg-blue-600' : ''}
                      ${isQuestionAnswered && quizQuestions[questionNumber].correct_option === quizQuestions[questionNumber].option_three ? 'bg-green-500' : ''}
                      ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_three && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}
                    `}
                    onClick={() => handleChoice(quizQuestions[questionNumber]?.option_three)}
                  >
                    {quizQuestions[questionNumber]?.option_three}
                  </div>
                  <div 
                    className={`w-[400px] rounded-md flex justify-center items-center p-4 text-white transform active:scale-75 transition-transform 
                      hover:cursor-pointer 
                      ${!isQuestionAnswered ? 'bg-blue-400 hover:bg-blue-600' : ''}
                      ${isQuestionAnswered && quizQuestions[questionNumber].correct_option === quizQuestions[questionNumber].option_four ? 'bg-green-500' : ''}
                      ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_four && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}
                    `}
                    onClick={() => handleChoice(quizQuestions[questionNumber]?.option_four)}
                  >
                    {quizQuestions[questionNumber]?.option_four}
                  </div>
                </div>
                {isQuestionAnswered ? (
                  <>
                    <button
                      className="bg-gray-900 px-3 py-2 w-max text-white transform active:scale-75 transition-transform" 
                      onClick={() => {
                        if (questionNumber + 1 === questionLength) {
                          setQuizEnded(true);
                        } else {
                          setQuestionNumber(questionNumber + 1);
                        }
                        setIsQuestionAnswered(false);
                      }}
                    >
                      Next Question
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            // Quiz ended, display summary
            <div className="w-full h-full bg-white text-black flex flex-col justify-center items-center font-medium gap-8 p-8 shadow-lg">
              <div className="w-full text-center">
                <h1 className="text-4xl font-bold text-purple-700 mb-2">Quiz Summary</h1>
                <hr className="border-purple-500 w-16 mx-auto mb-4" />
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full flex justify-center items-center border-b-2 border-purple-500 pb-4">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Your score is {totalScore}</h2>
                </div>
              </div>
              <div className="w-full text-center pt-4">
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-8 rounded-md mr-4"
                  onClick={() => {
                    handleRestartQuiz()
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Render a loading indicator or message while quizQuestions is empty
        
        <div className="h-screen w-full flex justify-center items-center">
          <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
          </svg>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
};

export default Index;
