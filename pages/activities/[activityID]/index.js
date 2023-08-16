import Link from 'next/link'
import React, { useState } from 'react'
import Layout from '../../../components/Layout'
import Introduction from '../../../components/introduction'
import Activity from '../../../components/activity'
import Summary from '../../../components/summary'



export default function Index() {
  const [currentStep, setCurrentStep] = useState(0)

  return (

    <div className="flex w-full h-screen gap-4">
      <div className='w-2/3'>{currentStep === 0 ? <Introduction /> : currentStep === 1 ? <Activity /> : <Summary />}</div>
      <div className='w-1/4 h-full bg-[#1C3253] shadow-sm grid place-items-center grid-flow-row '>
      <h2 class="text-4xl font-extrabold dark:text-white">Topic</h2>
        <ul class="steps steps-vertical ">
          <li class={`step ${
                currentStep >= 0
                ? "step-error"
                : "step-neutral"
              }`}>Introduction</li>
          <li class={`step ${
                currentStep >= 1
                ? "step-error"
                : "step-neutral"
              }`}>Activity</li>
          <li class={`step ${
                currentStep == 2
                ? "step-error"
                : "step-neutral"
              }`}>Summary</li>
        </ul>
        <div className="mt-10 p-5">
          {currentStep > 0 && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-5 transform active:scale-x-75 transition-transform"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </button>
          )}
          {currentStep < 2 && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transform active:scale-x-75 transition-transform"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </button>
          )}
          {currentStep == 2 && (
            <Link href="/">

          
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transform active:scale-x-75 transition-transform"
            >
              Finish
            </button>
            </Link>
          )}
        </div>
      </div>
      
    </div>
  )}

  Index.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }