import { React, useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";


const Index = () => {
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [questionLength, setQuestionLength] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const read_token = "b521909b1c6ca5ccdea20686de81ce01d11ce597";
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `https://api.buttercms.com/v2/content/my_quiz_app?auth_token=${read_token}`
      );
      setQuizQuestions(result.data.data.my_quiz_app);
      setQuestionLength(result.data.data.my_quiz_app.length);
    };
    fetchData()
  }, []);

const handleChoice = (choice) => {
  if (choice === quizQuestions[questionNumber]?.correct_option && !isQuestionAnswered) {
    setIsQuestionAnswered(true);
    setTotalScore(totalScore + 1);
    alert("You got it correctly");
  } else if (choice !== quizQuestions[questionNumber]?.correct_option && !isQuestionAnswered) {
    setIsQuestionAnswered(true);
    alert("Oops, you got it wrong");
  }
  else{
    alert("You have already answered this question");
  }
  };
  return (
    <>
    <div className="h-screen w-full flex justify-center items-center">
      {!quizEnded ? (
        <div className="h-screen w-full flex justify-center items-center">
          <div className="h-full w-full bg-white flex flex-col justify-center items-center text-black font-medium gap-16">
            <h1 className="text-2xl p-10">{quizQuestions[questionNumber]?.quiz_question}</h1>
            <div className="grid grid-cols-2 gap-8 gap-x-12">
              {/* options */}
              <div className="w-[400px] rounded-md flex justify-center items-center p-4 text-white bg-blue-400 hover:cursor-pointer hover:bg-blue-600" onClick={()=>handleChoice(quizQuestions[questionNumber]?.option_one)} >
                {quizQuestions[questionNumber]?.option_one}
              </div>
              <div className="w-[400px] rounded-md flex justify-center items-center p-4 text-white bg-blue-400 hover:cursor-pointer hover:bg-blue-600" onClick={()=>handleChoice(quizQuestions[questionNumber]?.option_two)} >
                {quizQuestions[questionNumber]?.option_two}
              </div>
              <div className="w-[400px] rounded-md flex justify-center items-center p-4 text-white bg-blue-400 hover:cursor-pointer hover:bg-blue-600" onClick={()=>handleChoice(quizQuestions[questionNumber]?.option_three)} >
                {quizQuestions[questionNumber]?.option_three}
              </div>
              <div className="w-[400px] rounded-md flex justify-center items-center p-4 text-white bg-blue-400 hover:cursor-pointer hover:bg-blue-600" onClick={()=>handleChoice(quizQuestions[questionNumber]?.option_four)} >
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
        <h1>Hurray, you have completed the quiz!</h1>
        <h1 className="text-2xl">Your score is {totalScore} out of {questionLength}</h1>
        <button
          className=" bg-gray-900 px-3 py-2 w-max text-white "
          onClick={() => {
            setQuestionNumber(0);
            setQuizEnded(false);
            setTotalScore(0);
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