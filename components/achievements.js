import React, { useEffect, useState } from "react";
import Image from "next/image";

const AchievementsComponent = ({ userID, onClose }) => {
  const [userScores, setUserScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const achievements = [
    {
      id: 1,
      name: "Activity Enthusiast",
      description: "Complete three activities",
      condition: (userScores) => {
        const completedActivities = userScores.filter(
          (score) => score.score > 0
        );
        return completedActivities.length >= 3;
      },
      progress: Math.min((userScores.length / 3) * 100, 100),
    },
    {
      id: 2,
      name: "Speedster",
      description: "Finish an activity within 30 seconds",
      condition: (userScores) => {
        const completedActivities = userScores.filter(
          (score) => score.timeFinished < 30
        );
        return completedActivities.length > 0;
      },
      progress: 0,
    },
    {
      id: 3,
      name: "Perfect Scorer",
      description: "Achieve a perfect score in an activity",
      condition: (userScores) =>
        userScores.some((score) => score.score === 100),
      progress: userScores.some((score) => score.score === 100) ? 1 : 0,
    },
    {
      id: 4,
      name: "Hustler",
      description: "Finish an activity within 10 seconds",
      condition: (userScores) => {
        const completedActivities = userScores.filter(
          (score) => score.timeFinished < 10
        );
        return completedActivities.length > 0;
      },
      progress: 0,
    },
    {
      id: 5,
      name: "Dedicated",
      description: "Complete all activities available",
      condition: (userScores) => userScores.length >= 10,
      progress: userScores.length >= 10 ? 1 : userScores.length / 10,
    },
    {
      id: 6,
      name: "Star Collector",
      description: "Collect 30 stars in total",
      condition: (userScores) => {
        const totalStars = userScores.reduce(
          (total, score) => total + (score.score / 100) * 3, // Each activity can contribute up to 3 stars
          0
        );
        return totalStars >= 30;
      },
      progress:
        Math.min(
          (userScores.reduce(
            (total, score) => total + (score.score / 100) * 3,
            0
          ) /
            30) *
            100,
          100
        ) / 100,
    },
    {
      id: 7,
      name: "Persistent Learner",
      description: "Complete 5 activities in a row",
      condition: (userScores) => {
        let consecutiveCount = 0;
        for (let i = 0; i < userScores.length; i++) {
          if (userScores[i].score > 0) {
            consecutiveCount++;
            if (consecutiveCount === 5) return true;
          } else {
            consecutiveCount = 0;
          }
        }
        return false;
      },
      progress: 0,
    },
    // {
    //   id: 8,
    //   name: "Master Speedster",
    //   description: "Finish all activities within 20 seconds each",
    //   condition: (userScores) => {
    //     return userScores.every((score) => score.timeFinished < 20);
    //   },
    //   progress: 0,
    // },
    {
      id: 9,
      name: "Perfectionist",
      description: "Achieve a perfect score in at least 5 activities",
      condition: (userScores) => {
        const perfectScoredActivities = userScores.filter(
          (score) => score.score === 100
        ).length;
        return perfectScoredActivities >= 5;
      },
      progress: Math.min(
        (userScores.filter((score) => score.score === 100).length / 5) * 100,
        100
      ),
    },
  ];

  useEffect(() => {
    const fetchUserScore = async () => {
      try {
        const scoreRes = await fetch(`/api/achievements?uid=${userID}`);
        const scoreData = await scoreRes.json();
        setUserScores(scoreData);
        console.log(scoreData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user score:", error);
        setLoading(false);
      }
    };

    fetchUserScore();
  }, [userID]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/assets/r_loading.png"
          height={300}
          className="robot-image pointer-events-none select-none"
          width={300}
          alt="Loading"
          loading="eager"
          draggable="false"
          priority
        />
        Loading...
      </div>
    ); // Add a loading indicator
  }

  return (
    <div>
      <button
        className="justify-self-start text-gray-600 hover:text-gray-900"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>
      <div className="mb-4 flex items-center justify-center gap-4">
        <Image
          src="/assets/achievements_icon.svg"
          height={50}
          className="pointer-events-none select-none"
          width={50}
          alt="Loading"
          loading="eager"
          draggable="false"
          priority
        />
        <h1 className="mb-8 mt-4 text-center font-boom text-3xl">
          Achievements
        </h1>
        <Image
          src="/assets/achievements_icon.svg"
          height={50}
          className="pointer-events-none select-none"
          width={50}
          alt="Loading"
          loading="eager"
          draggable="false"
          priority
        />
      </div>
      <div className="overflow-y-auto px-4 scrollbar scrollbar-track-gray-100 scrollbar-thumb-red-500">
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            let additionalInfo = "";
            let progressValue = "0";
            if (userScores && userScores.length > 0) {
              if (achievement.id === 1) {
                const activitiesFinished = Math.min(
                  userScores.filter((score) => score.score > 0).length,
                  3
                );
                additionalInfo = `Activities finished: ${activitiesFinished}/3`;
                progressValue = `${activitiesFinished}/3`;
              } else if (achievement.id === 2) {
                const fastestTime = userScores.reduce(
                  (min, current) =>
                    current.timeFinished < min ? current.timeFinished : min,
                  userScores[0].timeFinished
                );
                additionalInfo = `Fastest time: ${fastestTime}s`;
                progressValue = `${
                  userScores.filter((score) => score.timeFinished < 30).length >
                  0
                    ? 1
                    : 0
                }/1`;
              } else if (achievement.id === 3) {
                const perfectScoredActivities = userScores.some(
                  (score) => score.score === 100
                )
                  ? 1
                  : 0;
                additionalInfo = `Perfectly scored activities: ${perfectScoredActivities}/1`;
                progressValue = `${perfectScoredActivities}/1`;
              } else if (achievement.id === 4) {
                const fastestTime = userScores.reduce(
                  (min, current) =>
                    current.timeFinished < min ? current.timeFinished : min,
                  userScores[0].timeFinished
                );
                additionalInfo = `Fastest time: ${fastestTime}s`;
                progressValue = `${
                  userScores.filter((score) => score.timeFinished < 10).length >
                  0
                    ? 1
                    : 0
                }/1`;
              } else if (achievement.id === 5) {
                additionalInfo = `Total activities completed: ${userScores.length}/10`;
                progressValue = `${userScores.length}/10`;
              } else if (achievement.id === 6) {
                const totalStars = userScores.reduce(
                  (total, score) => total + (score.score / 100) * 3,
                  0
                );
                additionalInfo = `Total Stars: ${Math.round(totalStars)}/30`;
                progressValue = `${Math.round(totalStars)}/30`;
              } else if (achievement.id === 7) {
                let consecutiveCount = 0;
                let maxConsecutiveCount = 0;
                for (let i = 0; i < userScores.length; i++) {
                  if (userScores[i].score > 0) {
                    consecutiveCount++;
                    if (consecutiveCount > maxConsecutiveCount) {
                      maxConsecutiveCount = consecutiveCount;
                      if (maxConsecutiveCount === 5) {
                        additionalInfo = `Consecutive activities completed: ${maxConsecutiveCount}`;
                        progressValue = `${maxConsecutiveCount}/5`;
                        break;
                      }
                    }
                  } else {
                    consecutiveCount = 0;
                  }
                }
                // } else if (achievement.id === 8) {
                //   const allWithinTwentySeconds = userScores.every(
                //     (score) => score.timeFinished <= 20
                //   );
                //   additionalInfo = `All activities finished within 20 seconds: ${
                //     allWithinTwentySeconds ? "Yes" : "No"
                //   }`;
                //   progressValue = allWithinTwentySeconds ? "1" : "0";
              } else if (achievement.id === 9) {
                const perfectScoredActivities = userScores.filter(
                  (score) => score.score === 100
                ).length;
                additionalInfo = `Perfectly scored activities: ${perfectScoredActivities}/5`;
                progressValue = `${Math.min(perfectScoredActivities)}/5`;
              }
            }

            return (
              <div
                key={achievement.id}
                className={
                  achievement.condition(userScores)
                    ? "mb-4 w-full border-2 border-green-500 p-4 font-ogoby"
                    : "mb-4 w-full border-2 p-4 font-ogoby"
                }
              >
                <h2 className="text-2xl">{achievement.name}</h2>
                <p className="mb-2 text-lg">{achievement.description}</p>
                <p className="text-stroke-achv text-lg text-yellow-400">
                  {additionalInfo}
                </p>
                <div className="w-full rounded-lg bg-gray-200">
                  <div
                    className="text-md text-stroke rounded-lg bg-green-500 py-1 text-center leading-none text-white"
                    style={{
                      width: achievement.condition(userScores)
                        ? "100%"
                        : `calc(${progressValue} / 1 * 100%)`,
                    }}
                  >
                    {progressValue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsComponent;
