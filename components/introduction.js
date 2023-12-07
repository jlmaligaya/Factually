import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Introduction = () => {
  const router = useRouter();
  const activityID = router.query.activityID;
  const [videoURL, setVideoURL] = useState(null);
  const [topicName, setTopicName] = useState(null);
  const [description, setDesc] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/introduction?activityID=${activityID}`);
        const activity = await res.json();

        setVideoURL(activity.video);
        setTopicName(activity.topic);
        setDesc(activity.desc);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVideo();
  }, [activityID]);

  if (!videoURL) {
    return (
      <div
        class="inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] text-warning opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
        role="status"
      >
        <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className=" h-full w-full overflow-auto bg-slate-100 scrollbar scrollbar-track-slate-300 scrollbar-thumb-red-500">
      <h2 class="my-10 ml-10 text-4xl font-extrabold text-black">
        {topicName}
      </h2>
      <div class="aspect-w-16 aspect-h-9 m-10 max-w-full">
        <iframe
          class="absolute top-0 left-0 h-full w-full"
          src={`${videoURL}?rel=0`}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <p class="m-10 mb-10 border-4 bg-white p-4 px-10 text-lg font-normal text-black dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

export default Introduction;
