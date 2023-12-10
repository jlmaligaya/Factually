import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Cutscene from "../../../components/cutscene";
import Head from "next/head";

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
        const currentActivityID = activityID || router.query.activityID;
        if (!currentActivityID) {
          router.push("/");
          return;
        }
        const res = await fetch(
          `/api/introduction?activityID=${currentActivityID}`
        );

        const activity = await res.json();

        setVideoURL(activity.video);
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
        <title>Activity</title>
        <link rel="icon" href="public\logo.png" />
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
                stroke="#FEE2E2"
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
                {/* Video player */}
                <iframe
                  className="p-10"
                  width="100%"
                  height="435"
                  src={`${videoURL}?rel=0`}
                  title="Video Player"
                ></iframe>
              </div>
              <div
                className="m-4 flex h-[400px] w-full items-center justify-center bg-[url('/assets/activity/l_title.png')] bg-contain bg-no-repeat"
                style={{ backgroundSize: "100% 100%" }}
              >
                <h1 className="text-with-stroke p-8 text-center font-ogoby text-5xl font-semibold text-white">
                  {topicName.toUpperCase()}
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
                <div className="p-10">
                  <h3 className="text-center text-3xl font-semibold text-white">
                    MISSION
                  </h3>
                  <p className="mt-4 text-lg text-white">{description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Relative div in the middle-bottom */}
          <div className="absolute bottom-12">
            <Link
              href={{
                pathname: "/activities/[activityID]/activity",
                query: { activityID },
              }}
              as={`/activities/${activityID}/activity/${gameType}`}
            >
              <div
                className="rounded-tr-full rounded-bl-full border-4 border-red-500 bg-white py-5 px-20 font-boom text-red-500 opacity-100"
                style={{ marginTop: "-20px" }}
              >
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
