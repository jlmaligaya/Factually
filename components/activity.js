import { React, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/router'

const Index = () => {
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [questionLength, setQuestionLength] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timer, setTimer] = useState(60);
  // const [hint, setHint] = useState(1);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const [choice, setChoice] = useState(null); // Declare choice state variable
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const activityID = router.query.activityID.toLowerCase()
      const result = await axios(
        `https://api.buttercms.com/v2/content/${activityID}?auth_token=02761a8192dfbdddfac4c05e304cf311c24e881a`
      );
      setQuizQuestions(result.data.data[activityID]);
      setQuestionLength(result.data.data[activityID].length);
    };
    fetchData()
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer => timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChoice = (choice) => {
    if (choice === quizQuestions[questionNumber]?.correct_option && !isQuestionAnswered) {
      setIsQuestionAnswered(true);
      setTotalScore(totalScore + 1);
      // alert("You got it correctly");
    } else if (choice !== quizQuestions[questionNumber]?.correct_option && !isQuestionAnswered) {
      setIsQuestionAnswered(true);
      setLives(lives - 1);
      // alert("Oops, you got it wrong");
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
    if (lives === 0 || timer === 0) {
      setQuizEnded(true);
    }
  };
  
  
  const handleRestartQuiz = () => {
    setLives(5);
    setTimer(60);
    setQuestionNumber(0);
    setQuizEnded(false);
    setIsQuestionAnswered(false);
    setTotalScore(0);
    setQuizQuestions(shuffleArray(quizQuestions));
    setChoice(null); // Reset choice state variable to null
    
  };

  useEffect(() => {
    handleEndQuiz();
  }, [lives, timer]);


  return (
    <>
      <div className="h-screen w-full flex justify-center items-center">
        {!quizEnded ? (
          <div className="h-screen w-full flex justify-center items-center">
            <div className="h-full w-full bg-white flex flex-col justify-center items-center text-black font-medium gap-16">
              <div className="flex justify-between w-full px-10 py-4">
                <div className="flex items-center">
                  <div className="text-red-500 h-6 w-6 mr-2">♥</div>
                  <span className="text-xl">{lives}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-xl">{timer} sec</span>
                  <div className=" h-6 w-6 flex justify-center items-center">
                    <span className="text-white">⏲️</span>
                  </div>
                </div>
              </div>
              <h1 className="text-2xl p-10">{quizQuestions[questionNumber]?.quiz_question}</h1>
              <div className="grid grid-cols-2 gap-8 gap-x-12">
                {/* options */}

<div 
  className={`w-[400px] rounded-md flex justify-center items-center p-4 text-white 
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
  className={`w-[400px] rounded-md flex justify-center items-center p-4 text-white 
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
  className={`w-[400px] rounded-md flex justify-center items-center p-4 text-white 
              hover:cursor-pointer 
              ${!isQuestionAnswered ? 'bg-blue-400 hover:bg-blue-600' : ''}
              ${isQuestionAnswered && quizQuestions[questionNumber].correct_option === quizQuestions[questionNumber].option_three ? 'bg-green-500' : ''}
              ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_three && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}`}
  onClick={() => handleChoice(quizQuestions[questionNumber]?.option_three)}
>
  {quizQuestions[questionNumber]?.option_three}
</div>
<div 
  className={`w-[400px] rounded-md flex justify-center items-center p-4 text-white 
              hover:cursor-pointer 
              ${!isQuestionAnswered ? 'bg-blue-400 hover:bg-blue-600' : ''}
              ${isQuestionAnswered && quizQuestions[questionNumber].correct_option === quizQuestions[questionNumber].option_four ? 'bg-green-500' : ''}
              ${isQuestionAnswered && choice === quizQuestions[questionNumber].option_four && choice !== quizQuestions[questionNumber][`option_${quizQuestions[questionNumber].correct_option.toLowerCase()}`] ? 'bg-red-500' : ''}`}
  onClick={() => handleChoice(quizQuestions[questionNumber]?.option_four)}
>
  {quizQuestions[questionNumber]?.option_four}
</div>

              </div>
              {isQuestionAnswered ? (
                <>
                  <button
                    className="bg-gray-900 px-3 py-2 w-max text-white"
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
                  <div className="w-full px-2">
                    <p className="max-h-[100px] overflow-y-auto mx-10">
                      {quizQuestions[questionNumber]?.explanation}
                    </p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-white text-black flex flex-col justify-center items-center font-medium gap-16 ">
            <h1>Quiz Summary</h1>
            <h1 className="text-2xl">Your score is {totalScore} out of {questionLength}</h1>
            
  
        <button
          className=" bg-gray-900 px-3 py-2 w-max text-white "
          onClick={() => {
            handleRestartQuiz()
          }}
        >
          Restart Quiz
        </button>
      </div>
      )}
      </div>
    </>
  )
};
export default Index;