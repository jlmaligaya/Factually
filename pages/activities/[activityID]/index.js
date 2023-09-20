import Link from 'next/link'
import React, { useState } from 'react'
import Layout from '../../../components/Layout'
import Introduction from '../../../components/introduction'
import Activity from '../../../components/activity'
import Summary from '../../../components/summary'

export default function Index() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="bg-[url('/assets/activity/l_bg.png')] bg-cover bg-center bg-no-repeat h-screen w-screen flex flex-col items-center justify-center bg-gray-200" style={{ backgroundSize: '100% 100%' }}>

      <div className="bg-[url('/assets/activity/l_main.svg')] bg-cover bg-center bg-no-repeat h-5/6 w-5/6 p-4 rounded-lg shadow-lg flex items-center justify-center">
        <div className="flex flex-col lg:flex-row justify-center h-3/4 w-3/4">
          <div className="w-2/3 h-full  flex flex-col">
            <div className="bg-[url('/assets/activity/l_horizontal.png')] bg-contain bg-no-repeat" style={{ backgroundSize: '100% 100%' }}>
            {/* Video player */}
            <iframe
              className='p-10'
              width="100%"
              height="435"
              src="https://www.youtube.com/embed/y2ni8Emo9z0?si=H-GcmNgdRtX8BOfi"
              title="Video Player"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <div className="w-full h-full bg-[url('/assets/activity/l_title.png')] bg-contain bg-no-repeat m-4 flex justify-center items-center" style={{ backgroundSize: '100% 100%' }}>
            <h1 className='text-3xl text-white font-semibold text-center font-boom'>Monster Hunter Nice</h1>
          </div>
          </div>
          {/* Right side (description) */}
          <div className="w-1/3 ml-10">
            {/* Description */}
            <div className="bg-[url('/assets/activity/l_vertical.png')] bg-no-repeat bg-cover h-full p-4 rounded-lg text-black font-retropix" style={{ backgroundSize: '100% 100%' }}>
              <div className='p-10'>
                <h3 className="text-3xl text-white font-semibold text-center">Description</h3>
                <p className='text-white text-lg mt-4'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam convallis velit ac neque tincidunt, eget tristique odio
                  auctor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

Index.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
