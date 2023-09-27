import { useState, useEffect } from 'react';
import Image from 'next/image';

const levels = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Chapter 6', 'Chapter 7', 'Chapter 8', 'Chapter 9', 'Chapter 10'];

const Leaderboard = () => {
  const [selectedLevel, setSelectedLevel] = useState(levels[0]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const activityId = `${activityIdPrefix}${String(levelNumber).padStart(6, "0")}`;
  
    return activityId;
  };
  

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true); // Set loading to true when fetching data

      const newActivityId = getActivityIdForLevel(selectedLevel);
      // Fetch leaderboard data based on the new activityId
      const res = await fetch(`/api/leaderboards?activityID=${newActivityId}`);
      const data = await res.json();
      setLeaderboardData(data);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error(error);
    }
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  useEffect(() => {
    // Fetch leaderboard data when selectedLevel changes
    fetchLeaderboardData();
  }, [selectedLevel]);

  return (
    <div className="h-full w-full bg-white text-gray-800 font-retropix font-3xl max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-4xl font-boom mb-8">Leaderboards</h1>
        <div>
          <select
            id="levelSelect"
            className="px-2 py-1 border border-gray-300 rounded text-lg"
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
          <div className='flex flex-col justify-center items-center p-10 text-xl'>
            <Image src={'/assets/r_loading.png'}
            height={300}
            className='robot-image'
            width={300}></Image>
            <p className='py-5 text-center'>Loading...</p>
          </div>
          
        ) : leaderboardData.length < 10 ? (
          <div className='flex flex-col justify-center items-center p-10 text-xl'>
            <Image src='/assets/r_dead.svg'
            height={300}
            width={300}></Image>
            <p className='py-5 text-center'>Not enough scores. Check again later.</p>
          </div>
          
        ) : (
          <div>
            {/* Render the leaderboard data here */}
            <table className="table-auto w-full">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-2">Rank</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Score</th>
                  {/* Add more table headers as needed */}
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((score, index) => (
                  <tr key={score.id} className={index % 2 === 0 ? 'bg-gray-100 text-center' : 'bg-white text-center'}>
                    <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-200 px-4 py-2">{score.user.username.toUpperCase()}</td>
                    <td className="border border-gray-200 px-4 py-2">{score.score}</td>
                    {/* Render additional data as needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
