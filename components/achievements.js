import React, { useEffect, useState } from "react";

const AchievementsComponent = ({ userID }) => {
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
      progress: 0,
    },
    {
      id: 4,
      name: "Punctual",
      description: "Complete all activities within 60 seconds each",
      condition: (userScores) =>
        userScores.every((score) => score.timeFinished <= 60),
      progress: 0,
    },
    {
      id: 5,
      name: "Dedicated",
      description: "Complete all activities available",
      condition: (userScores) => userScores.length >= 10,
      progress: 0,
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
      progress: 0,
    },
    // Add more achievements with progress properties as needed
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
    return <div>Loading...</div>; // Add a loading indicator
  }

  return (
    <div>
      <h1 className="mb-8 text-center font-boom text-3xl">Achievements</h1>
      <div className="max-h-96 overflow-y-auto px-4 scrollbar scrollbar-track-gray-100 scrollbar-thumb-red-500">
        {achievements.map((achievement) => {
          let additionalInfo = "";
          let progressValue = "0";
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
              userScores.filter((score) => score.timeFinished < 30).length > 0
                ? 1
                : 0
            }/1`;
          } else if (achievement.id === 3) {
            const perfectScoredActivities = userScores.filter(
              (score) => score.score === 100
            ).length;
            additionalInfo = `Perfectly scored activities: ${perfectScoredActivities}/1`;
            progressValue = `${perfectScoredActivities}/1`;
          } else if (achievement.id === 4) {
            additionalInfo = `All activities completed within 60 seconds`;
            progressValue = `${achievement.condition(userScores) ? 1 : 0}/1`;
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
          }

          return (
            <div
              key={achievement.id}
              className={
                achievement.condition(userScores)
                  ? "mb-4 w-full border-2 border-green-500 p-4"
                  : "mb-4 w-full border-2 p-4"
              }
            >
              <h2 className="text-lg font-semibold">{achievement.name}</h2>
              <p className="mb-2 text-sm">{achievement.description}</p>
              <p className="text-sm">{additionalInfo}</p>
              <div className="w-full rounded-lg bg-gray-200">
                <div
                  className="rounded-lg bg-green-500 py-1 text-center text-xs leading-none text-white"
                  style={{
                    width: achievement.condition(userScores)
                      ? "100%"
                      : `calc(${progressValue} / 3 * 100%)`,
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
  );
};

export default AchievementsComponent;
