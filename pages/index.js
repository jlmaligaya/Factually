import { prisma } from "../db";
import Layout from "../components/Layout";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useState, useRef, lazy, Suspense } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import LoadingScreen from "../components/loading";
import AvatarSelectionModal from "../components/AvatarSelectionModal";
import ScreenAdjustment from "../components/screenadjustment";
import Head from "next/head";
import UsernameSelectionModal from "../components/welcomeModal";

const GameSettingsModal = lazy(() => import("../components/settings"));
const Leaderboard = lazy(() => import("../components/summary"));

export default function Home({ useravatar, actv, userScore }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hoveredCircle, setHoveredCircle] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const clickAudioRef = useRef(null);
  const hoverAudioRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const [bgmVolume, setBgmVolume] = useState(0.5); // Initial BGM volume
  const [sfxVolume, setSfxVolume] = useState(0.5); // Initial SFX volume
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(useravatar.avatar === "0");
  const [showAvatarModal, setShowAvatarModal] = useState(isFirstTime);
  const [adjustmentCompleted, setAdjustmentCompleted] = useState(false);
  const [showAdjustment, setShowAdjustment] = useState(false);
  const [showUsernameSelection, setShowUsernameSelection] =
    useState(isFirstTime);
  const username = session ? session.user.section : null;
  const isInstructor = session && session.user.role === "instructor";

  const handleFinishAdjustment = () => {
    setAdjustmentCompleted(true);
    // Save in local storage that the adjustment has been completed
    localStorage.setItem("adjustmentCompleted", "true");
  };

  useEffect(() => {
    // Check if the adjustment has already been completed in local storage
    const isAdjustmentCompleted =
      localStorage.getItem("adjustmentCompleted") === "true";

    if (!isAdjustmentCompleted) {
      setShowAdjustment(true);
    }
  }, []);

  const handleAvatarSelection = (selectedAvatar) => {
    setIsFirstTime(false);
  };

  const handleCloseAvatarModal = () => {
    setShowAvatarModal(false);
  };

  // Function to toggle the settings modal
  const toggleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const toggleLeaderboardModal = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  // Updated playSoundEffect function
  const playSoundEffect = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  // Function to update BGM volume
  const onBgmVolumeChange = (volume) => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = volume;
      setBgmVolume(volume); // Update state
      localStorage.setItem("bgmVolume", volume.toString()); // Save the BGM volume to local storage
    }
  };

  // Function to update SFX volume
  const onSfxVolumeChange = (volume) => {
    if (clickAudioRef.current) {
      clickAudioRef.current.volume = volume;
    }
    if (hoverAudioRef.current) {
      hoverAudioRef.current.volume = volume;
    }
    // Update the SFX volume state
    setSfxVolume(volume);
    localStorage.setItem("sfxVolume", volume.toString()); // Save the SFX volume to local storage
  };

  // Function to calculate the number of stars based on the user's score (total out of 5)
  const calculateStars = (score) => {
    const maxStars = 3; // Maximum number of stars
    const maxScore = 100; // Maximum possible score

    // Calculate the number of stars as a percentage of the maximum
    const stars = (score / maxScore) * maxStars;

    // Round down to the nearest integer to get the number of stars
    return Math.floor(stars);
  };

  const isActivityLocked = (activityIndex) => {
    // Check if the user has a score in chapter 10
    if (isInstructor) {
      // If the user is an instructor, return false (activity is unlocked)
      return false;
    }
    const hasScoreInChapter10 = userScore.some((score) =>
      score.activityId.startsWith("AID000010")
    );

    // If the user has a score in chapter 10, disable activities with 3 stars
    if (hasScoreInChapter10) {
      const previousActivityStars = calculateStars(
        userScore.find((score) => score.activityId === actv[activityIndex].aid)
          ?.score || 0
      );
      return previousActivityStars >= 3;
    }

    // Check if any previous activity is locked
    for (let i = 0; i < activityIndex; i++) {
      const previousActivityStars = calculateStars(
        userScore.find((score) => score.activityId === actv[i].aid)?.score || 0
      );
      if (previousActivityStars < 2) {
        return true; // Activity is locked if any previous activity is locked
      }
    }
    return false; // Activity is not locked
  };

  const handleCircleClick = async (activityId) => {
    setIsFading(true);

    // Wait for a short duration for the fade-out effect
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Adjust the duration as needed

    router.push({
      pathname: `/activities/${activityId}`,
    }); // Navigate to the new page
  };

  useEffect(() => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    // Retrieve the BGM volume setting from local storage
    const savedBgmVolume = parseFloat(localStorage.getItem("bgmVolume"));
    if (!isNaN(savedBgmVolume) && backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = savedBgmVolume;
      setBgmVolume(savedBgmVolume);
    }

    // Retrieve the SFX volume setting from local storage
    const savedSfxVolume = parseFloat(localStorage.getItem("sfxVolume"));
    if (
      !isNaN(savedSfxVolume) &&
      clickAudioRef.current &&
      hoverAudioRef.current
    ) {
      clickAudioRef.current.volume = savedSfxVolume;
      hoverAudioRef.current.volume = savedSfxVolume;
      setSfxVolume(savedSfxVolume);
    }
  }, []);

  useEffect(() => {
    // Save the playback state to local storage when it changes
    const shouldPlayMusic =
      backgroundMusicRef.current && !backgroundMusicRef.current.paused;
    localStorage.setItem("shouldPlayMusic", shouldPlayMusic);
  }, [isFading]);

  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Factually</title>
          <link rel="icon" href="/logo.png" />
        </Head>
        <audio ref={clickAudioRef} src="/sounds/click.wav"></audio>
        <audio
          ref={hoverAudioRef}
          src="/sounds/hover.wav"
          preload="auto"
        ></audio>
        <audio
          ref={backgroundMusicRef}
          src="/sounds/bg_music.ogg"
          autoPlay
          loop
        ></audio>
        <Suspense fallback={<LoadingScreen />}>
          {showAdjustment && !adjustmentCompleted && (
            <ScreenAdjustment onFinishAdjustment={handleFinishAdjustment} />
          )}
          {showAvatarModal && !showUsernameSelection && (
            <AvatarSelectionModal
              onClose={handleCloseAvatarModal}
              onSelectAvatar={handleAvatarSelection}
              avatar={useravatar.avatar}
            />
          )}
          {showUsernameSelection && isFirstTime && (
            <UsernameSelectionModal
              onClose={() => setShowUsernameSelection(false)}
              username={session.user.username}
            />
          )}
          <div className="w-full bg-[url('/bground_menu.png')] bg-blend-darken">
            <div
              className={`transparent-overlay ${
                isFading ? "fade-out-overlay" : ""
              }`}
            />
            {showSettingsModal && (
              <GameSettingsModal
                isOpen={showSettingsModal}
                onClose={toggleSettingsModal}
                bgmVolume={bgmVolume}
                sfxVolume={sfxVolume}
                onBgmVolumeChange={onBgmVolumeChange}
                onSfxVolumeChange={onSfxVolumeChange}
                userFirstName={session.user.username} // Pass the user's first name as a prop
                userAvatar={session.user.avatar}
                userRole={session.user.role}
              />
            )}
            {console.log(session.user.avatar)}

            <div
              className={`flex w-full items-center justify-between pt-20 ${
                isFading ? "fade-out" : ""
              }`}
            >
              {/* Leaderboards icon */}
              <a
                onClick={
                  !isInstructor
                    ? () => {
                        toggleLeaderboardModal();
                        playSoundEffect(clickAudioRef, sfxVolume);
                      }
                    : undefined
                }
              >
                <div
                  className={`mb-4 ml-20 flex h-20 w-20 items-center justify-center rounded-full border-4 bg-amber-400 ${
                    isInstructor ? "pointer-events-none opacity-0" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-10 w-10"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
                    />
                  </svg>
                </div>
              </a>
              <div className="flex select-none flex-row lg:text-4xl">
                <Image
                  src="/assets/r_hi.svg"
                  height={80}
                  width={80}
                  className="robot-image p-4 sm:hidden"
                  draggable="false"
                  alt="Description"
                />
                <div className="text-with-stroke select-none font-boom text-white dark:text-white">
                  <div>
                    <h1 className="">
                      Welcome to{" "}
                      <span className="animate-text bg-gradient-to-r from-rose-500 via-slate-100 to-blue-500 bg-clip-text text-transparent">
                        Factually
                      </span>
                    </h1>
                  </div>
                  <h2 className="mt-5 text-center font-ogoby">
                    Misinformed? Be fact-ed!
                  </h2>
                </div>
              </div>
              {/* Settings icon */}
              <a
                onClick={() => {
                  toggleSettingsModal();
                  playSoundEffect(clickAudioRef, sfxVolume);
                }}
              >
                <div className="mb-4 mr-20 flex h-20  w-20 items-center justify-center rounded-full border-4 bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#5A5A5A"
                    className="h-10 w-10 transform"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </a>
            </div>
            {showLeaderboard && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="fixed inset-0 bg-black opacity-50"
                  onClick={toggleLeaderboardModal}
                ></div>
                <div className="w-4xl z-10 flex flex-col items-center rounded-md border-4 border-red-500 bg-white p-8 shadow-lg">
                  <Leaderboard onClose={toggleLeaderboardModal} />
                  {/* <button
                    className="w-1/2 rounded-lg border-2 border-black bg-red-500 px-4 py-2 text-center font-boom text-white hover:bg-red-600"
                    onClick={toggleLeaderboardModal}
                  >
                    Close
                  </button> */}
                </div>
              </div>
            )}
            <div>
              <div className="container">
                <div className="item ml-20 flex space-x-10">
                  {actv.map((item, index) => {
                    const userScoreForActivity = userScore.find(
                      (score) => score.activityId === item.aid
                    );
                    const numberOfStars = userScoreForActivity
                      ? calculateStars(userScoreForActivity.score)
                      : 0;
                    const isLocked = isActivityLocked(index);
                    const isLastUnlocked =
                      index === actv.length - 1 ||
                      (!isLocked && isActivityLocked(index + 1));

                    return (
                      <div
                        className={`circle select-none ${
                          isFading ? "fade-out" : ""
                        }`}
                        key={item.id}
                        onMouseEnter={() => {
                          if (!isLocked) {
                            setHoveredCircle(index);
                            playSoundEffect(hoverAudioRef, sfxVolume);
                          } else {
                            setShowTooltip(true);
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredCircle(null);
                          setShowTooltip(false);
                        }}
                        onClick={() => {
                          if (!isLocked) {
                            handleCircleClick(item.aid);
                            playSoundEffect(clickAudioRef, sfxVolume);
                          } else {
                            setShowTooltip(true);
                          }
                        }}
                        title={
                          showTooltip && isLocked
                            ? "Achieve 2 stars on the previous activity to unlock"
                            : ""
                        }
                      >
                        <div className="relative">
                          {isLastUnlocked && !isLocked && !isInstructor && (
                            <div className="absolute top-2">
                              <span className="relative flex h-4 w-4">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500"></span>
                              </span>
                            </div>
                          )}
                          <div
                            className={`circle-content group relative h-40 w-40 rounded-full ${
                              isLocked
                                ? "bg-gray-800"
                                : "bg-white transition delay-100"
                            } ${hoveredCircle === index ? "hovered" : ""}`}
                          >
                            {isLocked && (
                              <div className="lock-icon absolute inset-0 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="h-10 w-10 text-white"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                  />
                                </svg>
                              </div>
                            )}
                            {!isLocked && (
                              <>
                                <Image
                                  className="absolute inset-0 h-full w-full object-cover"
                                  height={300}
                                  width={300}
                                  src={item.img}
                                  alt={`Activity ${index + 1}`}
                                />
                                <div
                                  className={`overlay text-with-stroke absolute inset-0 flex items-center justify-center font-ogoby text-5xl ${
                                    hoveredCircle === index ? "hidden" : ""
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <div
                                  className={`overlay play-button absolute inset-0 flex items-center justify-center ${
                                    hoveredCircle === index ? "" : "hidden"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-10 w-10"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                                    />
                                  </svg>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {/* Stars section */}
                        {!isInstructor && (
                          <div className="m-5 grid grid-flow-col gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={i < numberOfStars ? "#FFD700" : "gray"}
                                stroke="black"
                                viewBox="0 0 24 24"
                                className="h-8 w-8"
                              >
                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.040.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                              </svg>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Suspense>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signIn",
        permanent: false,
      },
    };
  }

  const actv = await prisma.activities.findMany({
    orderBy: [
      {
        aid: "asc",
      },
    ],
  });

  const useravatar = await prisma.user.findUnique({
    where: {
      username: session.user.username,
    },
    select: {
      avatar: true,
    },
  });

  const userScore = await prisma.score.findMany({
    where: {
      userId: session.user.uid,
    },
    // Select only necessary fields and convert createdAt to a string
    select: {
      score: true,
      activityId: true,
    },
  });

  return {
    props: {
      useravatar,
      actv,
      userScore,
    },
  };
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
