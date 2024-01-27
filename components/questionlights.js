// QuestionLights.js

import React from "react";

const LightsQuestions = ({
  questionCount,
  correctAnswers,
  currentQuestionIndex,
}) => {
  const lights = Array.from({ length: questionCount }, (_, index) => (
    <div
      key={index}
      className={`mx-1 h-8 w-8 rounded-full border-4 border-black ${
        correctAnswers[index] === true
          ? "bg-green-500"
          : correctAnswers[index] === false
          ? "bg-red-500"
          : "bg-gray-500"
      } ${
        index === currentQuestionIndex
          ? "animate-pulse border-4 border-yellow-400"
          : ""
      }`}
    />
  ));

  return <div className="flex">{lights}</div>;
};

export default LightsQuestions;
