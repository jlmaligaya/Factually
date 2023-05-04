import { useRouter } from "next/router";
import { useState, useEffect } from 'react'



const Introduction = () => {
  const router = useRouter();
  const activityID = router.query.activityID
  const [videoURL, setVideoURL] = useState(null)
  const [topicName, setTopicName] = useState(null)
  const [description, setDesc] = useState(null)


  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/introduction?activityID=${activityID}`)
        const activity = await res.json()

        setVideoURL(activity.video)
        setTopicName(activity.topic)
        setDesc(activity.desc)
      } catch (error) {
        console.error(error)
      }
    }

    fetchVideo()
  }, [activityID])

  if (!videoURL) return
    <div
    class="inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] text-warning opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
    role="status">
    <span
      class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
      >Loading...</span
    >
  </div>

  
    
    return (
      <div className=' bg-white h-full w-full overflow-auto scrollbar scrollbar-thumb-red-500 scrollbar-track-slate-300'>
      <h2 class="text-4xl font-extrabold text-black my-10 ml-10">{topicName}</h2>
        <div class="aspect-w-16 aspect-h-9 max-w-full m-10">
          <iframe class="absolute top-0 left-0 w-full h-full" src={videoURL} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <p class="px-10 mb-10 text-lg font-normal text-gray-500 dark:text-gray-400">{description}</p>
        
      </div>
    )
  };


  export default Introduction;