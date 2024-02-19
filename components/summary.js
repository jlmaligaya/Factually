import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import AchievementsComponent from "./achievements";

const levels = [
  "Chapter 1",
  "Chapter 2",
  "Chapter 3",
  "Chapter 4",
  "Chapter 5",
  "Chapter 6",
  "Chapter 7",
  "Chapter 8",
  "Chapter 9",
  "Chapter 10",
];

const MainMenu = ({ handleMenuSelect }) => {
  return (
    <div className="mb-4 flex flex-col items-center justify-center gap-4 font-boom text-lg">
      <div>STATISTICS</div>
      <button
        className="my-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        onClick={() => handleMenuSelect("achievements")}
      >
        Achievements
      </button>
      <button
        className="my-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        onClick={() => handleMenuSelect("leaderboards")}
      >
        Leaderboards
      </button>
    </div>
  );
};

const LeaderboardContent = ({
  levels,
  selectedLevel,
  handleLevelChange,
  loading,
  leaderboardData,
  userRank,

  onClose,
}) => {
  return (
    <div>
      <div className="mb-4 flex flex-col justify-center gap-5">
        <button
          onClick={onClose}
          className="justify-self-start text-gray-600 hover:text-gray-900"
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
        <div className="flex flex-row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="yellow"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="mr-2 h-9 w-9"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
            />
          </svg>
          <h1 className="mb-8 w-full text-center font-boom text-3xl">
            Leaderboard
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="yellow"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="ml-2 h-9 w-9"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <select
          id="levelSelect"
          className="rounded border border-gray-300 px-2 py-1 text-lg"
          value={selectedLevel}
          onChange={handleLevelChange}
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center p-10 text-xl">
          <Image
            src={"/assets/r_loading.png"}
            height={300}
            className="robot-image pointer-events-none"
            width={300}
          ></Image>
          <p className="py-5 text-center">Loading...</p>
        </div>
      ) : leaderboardData.length == 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-xl">
          <Image
            src="/assets/r_dead.svg"
            className="pointer-events-none"
            height={300}
            width={300}
          ></Image>
          <p className="text-center">
            No players have reached this level.
            <br />
            Check again later.
          </p>
        </div>
      ) : (
        <div>
          {/* Render the leaderboard data here */}
          <table className="w-full table-auto">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Time</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((score, index) => (
                <tr
                  key={score.id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-100 text-center"
                      : "bg-white text-center"
                  }
                  // Apply gold, silver, or bronze classes to the top 3 rows
                  {...(index < 3
                    ? {
                        className: `${
                          index === 0
                            ? "border-t-4 border-gold"
                            : index === 1
                            ? "border-t-4 border-silver"
                            : "border-t-4 border-bronze"
                        } ${
                          index % 2 === 0
                            ? "bg-gray-100 text-center"
                            : "bg-white text-center"
                        }`,
                      }
                    : {})}
                >
                  <td className="border border-gray-200 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="flex items-center gap-4 border border-gray-200 px-4 py-2">
                    <div>
                      {" "}
                      <Image
                        src={`/avatars/${score.user.avatar}.png`}
                        alt={`${score.user.username}`}
                        width={35}
                        height={35}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      {score.user.username}
                      {/* {score.user.firstName.toUpperCase()}&nbsp;
                      {score.user.lastName.toUpperCase()} */}
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {score.score}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {score.timeFinished}s
                  </td>
                  {/* Render additional data as needed */}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">Current Rank: #{userRank}</div>
        </div>
      )}
    </div>
  );
};

const Main = ({ onClose }) => {
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const { data: session, status } = useSession();
  const avatar = session.user.avatar;
  const sectionId = session.user.section;
  const getActivityIdForLevel = (level) => {
    // Define the prefix for activity IDs
    const activityIdPrefix = "AID";

    // Define the number of activities you have
    const numActivities = 10;

    // Ensure the level is a number between 1 and numActivities
    const levelNumber = parseInt(level.replace("Chapter ", ""));
    if (isNaN(levelNumber) || levelNumber < 1 || levelNumber > numActivities) {
      return ""; // Handle invalid input if necessary
    }

    // Generate the activity ID based on the level number
    const activityId = `${activityIdPrefix}${String(levelNumber).padStart(
      6,
      "0"
    )}`;

    return activityId;
  };
  const [showMenu, setShowMenu] = useState(true);
  const [menuSelection, setMenuSelection] = useState("");

  const handleMenuSelect = (selection) => {
    setMenuSelection(selection);
    setShowMenu(false);
  };

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data

      const newActivityId = getActivityIdForLevel(selectedLevel);
      // Fetch leaderboard data based on the new activityId
      const res = await fetch(
        `/api/leaderboards?activityID=${newActivityId}&sectionId=${sectionId}`
      );
      const data = await res.json();
      setLeaderboardData(data);
      setLoading(false); // Set loading to false when data is fetched
      const userIndex = data.findIndex(
        (score) => score.user.username === session?.user?.username
      );
      setUserRank(userIndex !== -1 ? userIndex + 1 : null);
    } catch (error) {
      setLeaderboardData([]);
      console.error(error);
    }
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const handleClose = () => {
    setShowMenu(true); // Set the showMenu state to true to return to the main menu
  };

  useEffect(() => {
    // Fetch leaderboard data when selectedLevel changes
    fetchLeaderboardData();
  }, [selectedLevel, session]);

  return (
    <div className="font-3xl mx-auto h-full w-full max-w-7xl bg-white py-6 font-retropix text-gray-800 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center px-4 sm:px-0">
        {showMenu ? (
          <MainMenu handleMenuSelect={handleMenuSelect} />
        ) : menuSelection === "achievements" ? (
          <div>
            {/* ... (achievements component) */}
            <AchievementsComponent
              userID={session?.user?.uid}
              onClose={handleClose}
            />
          </div>
        ) : (
          <LeaderboardContent
            levels={levels}
            selectedLevel={selectedLevel}
            handleLevelChange={handleLevelChange}
            loading={loading}
            leaderboardData={leaderboardData}
            userRank={userRank}
            onClose={handleClose}
          />
        )}
        {showMenu && (
          <button
            className=" w-1/2 rounded-lg border-2 border-red-600 bg-red-500  text-center font-boom text-xl text-white hover:bg-red-600"
            onClick={onClose}
          >
            Exit
          </button>
        )}
      </div>
    </div>
  );
};

export default Main;
