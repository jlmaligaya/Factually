import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Index() {
  const router = useRouter();
  const activityID = router.query.activityID;
  const [videoURL, setVideoURL] = useState(null);
  const [topicName, setTopicName] = useState(null);
  const [description, setDesc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {data: session, status} = useSession();
  const userID = session.user.uid;

  console.log('uid: ', userID)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/introduction?activityID=${activityID}`);
        const activity = await res.json();

        setVideoURL(activity.video);
        setTopicName(activity.topic);
        setDesc(activity.desc);
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
                frameBorder="0"
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
        query: { userID: userID },
      }}
      as={`/activities/${activityID}/activity`}
    >
      <div className="bg-white text-red-500 font-boom border-4 rounded-tr-full rounded-bl-full border-red-500 opacity-100 py-5 px-20" style={{ marginTop: '-20px' }}>
        Start
      </div>
    </Link>
        </div>
      </div>
    </div>
  );
  
  
}

Index.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
