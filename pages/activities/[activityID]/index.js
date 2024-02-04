import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Cutscene from "../../../components/cutscene";
import Head from "next/head";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Index() {
  const router = useRouter();
  const { data: session } = useSession();
  const sectionName = session ? session.user.section : null;
  const activityID = router.query.activityID;
  const [videoURL, setVideoURL] = useState(null);
  const [topicName, setTopicName] = useState(null);
  const [description, setDesc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCutscene, setShowCutscene] = useState(true);
  const [gameType, setGameType] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const currentActivityID = activityID || router.query.activityID;
        if (!currentActivityID) {
          router.push("/");
          return;
        }
        const res = await fetch(
          `/api/introduction?activityID=${currentActivityID}`
        );

        const activity = await res.json();
        const response = await axios.get(
          `/api/checkCustomizedVideo?sectionName=${sectionName}&activityID=${activityID}`
        );
        const { videoURL } = response.data;
        setVideoURL(videoURL);
        setTopicName(activity.topic);
        setDesc(activity.desc);
        setGameType(activity.type);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        router.push("/");
      }
    };

    fetchVideo();
  }, [activityID, router]);

  // Function to handle the end of the video
  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  // Conditional rendering based on isLoading
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center bg-gray-200 bg-[url('/assets/activity/l_bg.png')] bg-cover bg-center bg-no-repeat"
      style={{ backgroundSize: "100% 100%" }}
    >
      <Head>
        <title>{topicName}</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      {showCutscene && (
        <Cutscene
          isIntro={true}
          activityID={activityID}
          onClose={() => setShowCutscene(false)}
        />
      )}
      <div
        className="flex h-screen w-screen flex-col items-center justify-center bg-gray-200 bg-[url('/assets/activity/l_bg.png')] bg-cover bg-center bg-no-repeat"
        style={{ backgroundSize: "100% 100%" }}
      >
        <div className={`flex w-full justify-between`}>
          {/* Back Button */}
          <div className="w-15 h-15 ml-20 flex items-center justify-center">
            <button
              className="absolute top-0 mt-10 rounded-full border-4 border-red-800 bg-red-600 p-4"
              onClick={() => router.push("/")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="black"
                class="h-8 w-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="static flex h-5/6 w-5/6 items-center justify-center rounded-lg bg-[url('/assets/activity/l_main.svg')] bg-cover bg-center bg-no-repeat p-4 shadow-lg">
          <div className="flex h-3/4 w-3/4 flex-col justify-center lg:flex-row">
            <div className="flex h-full  w-2/3 flex-col">
              <div
                className="bg-[url('/assets/activity/l_horizontal.png')] bg-contain bg-no-repeat"
                style={{ backgroundSize: "100% 100%" }}
              >
                {!showCutscene && (
                  <video
                    autoPlay
                    onEnded={handleVideoEnd}
                    className=" p-10"
                    width="100%"
                    height="435"
                    controls
                  >
                    <source src={videoURL} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div
                className="m-4 flex h-[400px] w-full items-center justify-center bg-[url('/assets/activity/l_title.png')] bg-contain bg-no-repeat"
                style={{ backgroundSize: "100% 100%" }}
              >
                <h1 className="text-with-stroke p-4 text-center font-ogoby font-semibold text-white md:text-xl 2xl:text-4xl">
                  {topicName?.toUpperCase()}
                </h1>
              </div>
            </div>
            {/* Right side (description) */}
            <div className="ml-10 w-1/3">
              {/* Description */}
              <div
                className="h-full rounded-lg bg-[url('/assets/activity/l_vertical.png')] bg-cover bg-no-repeat p-4 font-retropix text-black"
                style={{ backgroundSize: "100% 100%" }}
              >
                <div className="p-8 ">
                  <h3 className="text-stroke md:text-md text-center font-ogoby text-4xl text-yellow-200">
                    MISSION
                  </h3>
                  <p className="mt-4 text-justify font-retropix capitalize text-yellow-200 md:text-xs 2xl:text-xl  ">
                    {description?.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Relative div in the middle-bottom */}
          <div className="absolute bottom-12">
            <Link
              href={{
                pathname: "/activities/[activityID]/activity",
                query: { activityID, sectionName },
              }}
              as={`/activities/${activityID}/activity/${gameType}`}
            >
              <div
                className={`rounded-tr-full rounded-bl-full border-4 bg-white py-5 px-20 font-boom text-red-500 ${
                  videoEnded ? "opacity-100" : "opacity-50"
                }`}
                style={{
                  marginTop: "-20px",
                  cursor: videoEnded ? "pointer" : "not-allowed",
                }}
                onClick={videoEnded ? null : (e) => e.preventDefault()} // Prevent click event when disabled
              >
                {!videoEnded ? "Enabled after Video" : "Proceed to Activity"}
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
