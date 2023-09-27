import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react";
import Image from 'next/image';

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
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [choice, setChoice] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const userID = session ? session.user.uid : null;
  const activityID = router.query.activityID;
  const [loadingDone, setLoadingDone] = useState(false);


  // Fetches the questions from API only once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(`../../../api/questions?activityId=${activityID}`);
        const data = await result.json();
        setQuizQuestions(data);
        setQuestionLength(data.length);
        setLoadingDone(true); 
        setQuizStarted(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [activityID]);

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
      console.log(response.data)
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
      setLostLives([...lostLives, lives - 1]);
      setLives(lives - 1);
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
      postScore(userID, activityID, totalScore, retries, 60 - timer, 5 - lives);
      setLives(5);
      setTimer(60);
      setQuizEnded(true);
      // Only post the score when the quiz ends
      
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
      {quizQuestions.length > 0 ? (
        <div className="h-screen w-full flex justify-center items-center">
          {!quizEnded ? (
            <div className="h-screen w-full flex justify-center items-center">
              <div className="h-full w-full bg-[url('/chapters/1/actC1_bg.jpg')] bg-cover bg-center flex flex-col justify-center items-center text-white font-medium gap-16" style={{ backgroundSize: '100% 100%' }}>
                <div className="flex justify-between w-full px-10 absolute top-0">
                  {/* lives */}
                  <div className="flex gap-10 items-center mt-10">
                  {[...Array(lives)].map((_, i) => (
                      <div key={i} className="h-6 w-6 mr-2 relative">
                        {lostLives.includes(i) ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>                        
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>

                        )}
                      </div>
                    ))}
                  </div>
                  {/* timer */}
                  <div className="absolute top-0 left-0 h-5 bg-red-500" style={{ width: `${(timer / 60) * 100}%` }}></div>
                  
                </div>
                <div className="flex flex-col w-full h-full items-center justify-center gap-8">
                <div className="w-full max-w-6xl h-1/2 bg-[url('/chapters/1/actC1_main.png')] mt-15 bg-cover bg-center flex justify-center items-center" style={{ backgroundSize: '100% 100%' }}>
                  <h1 className="text-5xl text-center text-with-stroke font-ogoby p-10 rounded-md max-w-[80%] overflow-auto">{quizQuestions[questionNumber]?.quiz_question}</h1>
                </div>
                <div className="grid grid-flow-row justify-items-center lg:grid-cols-2 gap-x-0 gap-y-5 text-4xl text-center text-with-stroke font-ogoby w-full ">
                  {/* options */}
                  <div 
                    className={`w-[500px] h-[165px] bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center rounded-md flex justify-center items-center p-4 text-white transform active:scale-75 transition-transform 
                      hover:cursor-pointer 
                      ${!isQuestionAnswered ? '' : ''}
                      ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_one && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}
                    `}
                    onClick={() => {
                      handleChoice(quizQuestions[questionNumber]?.option_one);
                      setIsQuestionAnswered(true);
                      moveToNextQuestion(); // Move to the next question
                    }}
                    style={{ backgroundSize: '100% 100%' }}
                  >
                    <span className="p-10">{quizQuestions[questionNumber]?.option_one}</span>
                  </div>
                  <div 
                    className={`w-[500px] h-[165px] bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center rounded-md flex justify-center items-center p-4 text-white transform active:scale-75 transition-transform 
                      hover:cursor-pointer 
                      ${!isQuestionAnswered ? '' : ''}
                      ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_two && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}
                    `}
                    onClick={() => {
                      handleChoice(quizQuestions[questionNumber]?.option_two);
                      setIsQuestionAnswered(true);
                      moveToNextQuestion(); // Move to the next question
                    }}
                    style={{ backgroundSize: '100% 100%' }}
                  >
                    <span className="p-10">{quizQuestions[questionNumber]?.option_two}</span>
                  </div>
                  <div 
                    className={`w-[500px] h-[165px] bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center rounded-md flex justify-center items-center p-4 text-white transform active:scale-75 transition-transform
                      hover:cursor-pointer 
                      ${!isQuestionAnswered ? '' : ''}
                      ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_three && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}
                    `}
                    onClick={() => {
                      handleChoice(quizQuestions[questionNumber]?.option_three);
                      setIsQuestionAnswered(true);
                      moveToNextQuestion(); // Move to the next question
                    }}
                    style={{ backgroundSize: '100% 100%' }}
                  >
                    <span className="p-10">{quizQuestions[questionNumber]?.option_three}</span>
                  </div>
                  <div 
                    className={`w-[500px] h-[165px] bg-[url('/chapters/1/actC1_gray.png')] bg-cover bg-center rounded-md flex justify-center items-center p-4 text-white transform active:scale-75 transition-transform 
                      hover:cursor-pointer 
                      ${!isQuestionAnswered ? '' : ''}
                      ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_four && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}
                    `}
                    onClick={() => {
                      handleChoice(quizQuestions[questionNumber]?.option_four);
                      setIsQuestionAnswered(true);
                      moveToNextQuestion(); // Move to the next question
                    }}
                    style={{ backgroundSize: '100% 100%' }}
                  >
                    <span className="p-10">{quizQuestions[questionNumber]?.option_four}</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
          ) : (
            
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
                        totalScore >= (questionLength / 3) * index + 1 ? 'fadeIn' : 'hidden'
                      } transition-opacity duration-1000`}
                    >
                      {/* Insert your star SVG or image here */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" stroke-width="1" stroke="black" class="w-100 h-100">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex w-full gap 4 justify-center  pt-4 gap-4">
                <button
                  className="bg-red-500 hover:bg-red-600 w-1/6 max-w-1/6 flex justify-center items-center text-white font-boom rounded-md"
                  onClick={handleRestartQuiz}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 flex justify-center items-center w-1/6 max-w-1/6 text-white font-boom py-3 px-8 rounded-md"
                  onClick={() => router.push('/')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`h-screen w-full flex flex-col justify-center items-center p-10 text-3xl bg-slate-900 font-retropix ${loadingDone ? 'fade-out' : ''}`}>
          <Image src={'/assets/r_loading.png'}
          height={300}
          className='robot-image'
          width={300}></Image>
          <p className='py-5 text-center'>Loading...</p>
        </div>
      )}
    </>
  );
};

export default Index;
