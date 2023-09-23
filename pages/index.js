import { prisma } from '../db';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home({ data, actv, userScore }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hoveredCircle, setHoveredCircle] = useState(null);
  const [isFading, setIsFading] = useState(false);

  const clickAudioRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const backgroundMusicRef = useRef(null);

  // Function to play the sound effect
  const playSoundEffect = (audioRef, volume = 1) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  // Function to calculate the number of stars based on the user's score (total out of 5)
  const calculateStars = (score) => {
    const maxStars = 3; // Maximum number of stars
    const maxScore = 5; // Maximum possible score

    // Calculate the number of stars as a percentage of the maximum
    const stars = (score / maxScore) * maxStars;

    // Round down to the nearest integer to get the number of stars
    return Math.floor(stars);
  };

  // Function to determine if an activity is locked
  const isActivityLocked = (activityIndex) => {
    for (let i = 0; i < activityIndex; i++) {
      const previousActivityStars = calculateStars(userScore.find(score => score.activityId === actv[i].aid)?.score || 0);
      if (previousActivityStars < 2) {
        return true; // Activity is locked if any previous activity is locked
      }
    }
    return false; // Activity is not locked
  };

  const handleCircleClick = async (activityId) => {
    setIsFading(true);

    // Wait for a short duration for the fade-out effect
    await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust the duration as needed

    router.push({
      pathname: `/activities/${activityId}`,
      query: { userID: session.user.uid }, // Pass the userID as a query parameter
    }); // Navigate to the new page
  };

  useEffect(() => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    // Check if audio should be playing and set the playback state
    const shouldPlayMusic = localStorage.getItem('shouldPlayMusic') === 'true';

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = 0.2;

      if (shouldPlayMusic) {
        backgroundMusicRef.current.play();
      }
    }
  }, []);

  useEffect(() => {
    // Save the playback state to local storage when it changes
    const shouldPlayMusic = backgroundMusicRef.current && !backgroundMusicRef.current.paused;
    localStorage.setItem('shouldPlayMusic', shouldPlayMusic);
  }, [isFading]);

  if (status === 'authenticated') {
    return (
      <>
        
        <audio ref={clickAudioRef} src="/sounds/click.wav"></audio>
        <audio ref={hoverAudioRef} src="/sounds/hover.wav" preload="auto" ></audio>
        <audio ref={backgroundMusicRef} src="/sounds/bg_music.ogg" autoPlay loop></audio>
        <div>
        <div className={`flex justify-between items-center pt-20 ${isFading ? 'fade-out' : ''}`}>
            {/* Settings icon */}
            <a href="#" onClick={signOut}>
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-4 ml-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#5A5A5A" className="w-10 h-10 transform animate-spin">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </a>
            <div className="flex flex-row select-none">
              <img src="/assets/r_hi.svg" className="h-50 w-20 animate-bounce" alt="Description" />
              <h1 className="mb-4 px-4 font-boom text-white dark:text-white md:text-3xl text-with-stroke lg:text-4xl select-none">Welcome to <span className="select-none animate-text bg-gradient-to-r from-rose-500 via-slate-100 to-blue-500 bg-clip-text text-transparent text-4xl font-boom text-to">Factually</span>, {session.user.firstName}</h1>
            </div>
            {/* Logout icon */}
            <a href="#" onClick={signOut}>
              <div className="w-16 h-16 bg-red-500 rounded-3xl flex items-center justify-center mb-4 mr-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="2" stroke="white" className="w-10 h-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </div>
            </a>
          </div>
          <div>
            <div className="container">
              <div className="flex space-x-10 item">
                {actv.map((item, index) => {
                  const userScoreForActivity = userScore.find(score => score.activityId === item.aid);
                  const numberOfStars = userScoreForActivity ? calculateStars(userScoreForActivity.score) : 0;
                  const isLocked = isActivityLocked(index);
                  const isLastUnlocked = index === actv.length - 1 || (!isLocked && isActivityLocked(index + 1));

                  return (
                    <div
                      className={`circle select-none ${isFading ? 'fade-out' : ''}`}
                      key={item.id}
                      onMouseEnter={() => {
                        if (!isLocked) {
                          setHoveredCircle(index);
                          playSoundEffect(hoverAudioRef, 0.5);
                        }
                      }}
                      onMouseLeave={() => setHoveredCircle(null)}
                      onClick={() => {
                        if (!isLocked) {
                          handleCircleClick(item.aid);
                          playSoundEffect(clickAudioRef, 0.5);
                        }
                      }}
                    >

                    <div className="relative">
                    {isLastUnlocked && !isLocked && (
                      <div className="absolute top-2">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                        </span>
                      </div>
                    )}
                      <div className={`circle-content h-40 w-40 rounded-full relative group ${isLocked ? 'bg-gray-800' : 'transition delay-100 bg-white'} ${hoveredCircle === index ? 'hovered' : ''}`}>
                        {isLocked && (
                          <div className="lock-icon absolute inset-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-white">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          </div>
                        )}
                        {!isLocked && (
                          <>
                            <img className="absolute inset-0 object-cover w-full h-full" src={item.img} alt={`Activity ${index + 1}`} />
                            <div className={`overlay absolute inset-0 flex items-center text-5xl font-ogoby text-with-stroke justify-center ${hoveredCircle === index ? 'hidden' : ''}`}>
                              {index + 1}
                            </div>
                            <div className={`overlay play-button absolute inset-0 flex items-center justify-center ${hoveredCircle === index ? '' : 'hidden'}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                              </svg>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                      {/* Stars section */}
                      <div className="grid grid-flow-col gap-3 m-5">
                        {Array.from({ length: numberOfStars }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#FFD700"
                            viewBox="0 0 24 24"
                            className="w-8 h-8"
                          >
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.040.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signIn',
        permanent: false,
      },
    };
  }

  const actv = await prisma.activities.findMany({
    orderBy: [
      {
        aid: 'asc',
      },
    ],
  });

  const userScore = await prisma.score.findMany({
    where: {
      userId: session.user.uid,
    },
    // Select only necessary fields and convert createdAt to a string
    select: {
      score: true,
      activityId: true,
      createdAt: true,
    },
  });

  // Convert createdAt to strings
  userScore.forEach((score) => {
    score.createdAt = score.createdAt.toISOString();
  });

  return {
    props: {
      actv,
      userScore,
    },
  };
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
