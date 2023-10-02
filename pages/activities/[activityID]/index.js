import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Cutscene from '../../../components/cutscene';

export default function Index() {
  const router = useRouter();
  const activityID = router.query.activityID;
  const [videoURL, setVideoURL] = useState(null);
  const [topicName, setTopicName] = useState(null);
  const [description, setDesc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCutscene, setShowCutscene] = useState(true);
  const [gameType, setGameType] = useState(0);


  
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/introduction?activityID=${activityID}`);
        const activity = await res.json();

        setVideoURL(activity.video);
        setTopicName(activity.topic);
        setDesc(activity.desc);
        setGameType(activity.type);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [activityID]);

  // Conditional rendering based on isLoading
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="bg-[url('/assets/activity/l_bg.png')] bg-cover bg-center bg-no-repeat h-screen w-screen flex flex-col items-center justify-center bg-gray-200" style={{ backgroundSize: '100% 100%' }}>
      {showCutscene && (
        <Cutscene onClose={() => setShowCutscene(false)} />
      )}
      <div className="bg-[url('/assets/activity/l_bg.png')] bg-cover bg-center bg-no-repeat h-screen w-screen flex flex-col items-center justify-center bg-gray-200" style={{ backgroundSize: '100% 100%' }}>
      <div className={`flex justify-between w-full`}>
            {/* Back Button */}
              <div className="w-15 h-15 flex items-center justify-center ml-20">
                <button className='bg-red-600 border-4 border-red-800 p-4 mt-10 rounded-full absolute top-0' onClick={() => router.push('/')}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="#FEE2E2" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                  </svg>
                </button>
              </div>
          </div>
      <div className="bg-[url('/assets/activity/l_main.svg')] static bg-cover bg-center bg-no-repeat h-5/6 w-5/6 p-4 rounded-lg shadow-lg flex items-center justify-center">
        <div className="flex flex-col lg:flex-row justify-center h-3/4 w-3/4">
          <div className="w-2/3 h-full  flex flex-col">
            <div className="bg-[url('/assets/activity/l_horizontal.png')] bg-contain bg-no-repeat" style={{ backgroundSize: '100% 100%' }}>
              {/* Video player */}
              <iframe
                className="p-10"
                width="100%"
                height="435"
                src={`${videoURL}?rel=0`}
                title="Video Player"
                allowFullScreen
              ></iframe>
            </div>
            <div className="w-full h-full bg-[url('/assets/activity/l_title.png')] bg-contain bg-no-repeat m-4 flex justify-center items-center" style={{ backgroundSize: '100% 100%' }}>
              <h1 className="text-3xl text-white font-semibold text-center font-boom">{topicName}</h1>
            </div>
          </div>
          {/* Right side (description) */}
          <div className="w-1/3 ml-10">
            {/* Description */}
            <div className="bg-[url('/assets/activity/l_vertical.png')] bg-no-repeat bg-cover h-full p-4 rounded-lg text-black font-retropix" style={{ backgroundSize: '100% 100%' }}>
              <div className="p-10">
                <h3 className="text-3xl text-white font-semibold text-center">Description</h3>
                <p className="text-white text-lg mt-4">{description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Relative div in the middle-bottom */}
        <div className="absolute bottom-12">
          
        <Link
      href={{
        pathname: '/activities/[activityID]/activity',
        query: { activityID }, 
      }}
      as={`/activities/${activityID}/activity/${gameType}`}
    >
      <div className="bg-white text-red-500 font-boom border-4 rounded-tr-full rounded-bl-full border-red-500 opacity-100 py-5 px-20" style={{ marginTop: '-20px' }}>
        Start
      </div>
    </Link>
        </div>
      </div>
    </div>
    </div>
  );
  
}

Index.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
