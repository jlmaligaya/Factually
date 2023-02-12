import Head from 'next/head'
import React, { useState } from 'react'

const Activity = () => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [questions, setQuestions] = React.useState([
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Rome'],
      answer: 'Paris',
    },
    {
      question: 'What is the currency used in Japan?',
      options: ['Yen', 'Dollar', 'Euro', 'Pound'],
      answer: 'Yen',
    },
    {
      question: 'What is the tallest mountain in the world?',
      options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse'],
      answer: 'Mount Everest',
    },
  ])

  const handleAnswer = (e) => {
    if (e.target.value === questions[currentQuestion].answer) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  return (
    <div className="p-10">
      <Head>
        <title>Quiz Game</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" />
      </Head>

      {currentQuestion < questions.length ? (
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-2xl text-black font-bold mb-4">
            {questions[currentQuestion].question}
          </h1>
          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                className="bg-blue-500 text-white py-2 px-4 rounded-full"
                onClick={handleAnswer}
                value={option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <h1 className="text-2xl font-bold mb-4">You Won!</h1>
      )}
    </div>
  )
}

export default Activity