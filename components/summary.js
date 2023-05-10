import { useState, useEffect } from 'react';


const dummyScores = [
  { id: 1, name: 'Player 1', score: 10, lives: 3, retries: 2, timeFinished: '36s'},
  { id: 2, name: 'Player 2', score: 8, lives: 2, retries: 1, timeFinished: '15s'},
  { id: 3, name: 'Player 3', score: 6, lives: 1, retries: 0, timeFinished:  '48s'},
  { id: 4, name: 'Player 4', score: 5, lives: 3, retries: 1, timeFinished:  '27s'},
  { id: 5, name: 'Player 5', score: 7, lives: 2, retries: 0, timeFinished: '9s' },
  { id: 6, name: 'Player 6', score: 2, lives: 1, retries: 0, timeFinished: '54s'},
  { id: 7, name: 'Player 7', score: 8, lives: 3, retries: 2, timeFinished:  '21s'},
  { id: 8, name: 'Player 8', score: 10, lives: 2, retries: 1, timeFinished: '41s'},
  { id: 9, name: 'Player 9', score: 1, lives: 1, retries: 0, timeFinished:'7s'},
  { id: 10, name: 'Player 10', score: 6, lives: 3, retries: 0, timeFinished: '33s'},
];


const Leaderboard = () => {
  const [scores, setScores] = useState(dummyScores);
  const topScores = scores.slice(0, 3); // Get the top 3 scores
  const otherScores = scores.slice(3); // Get the other scores
  const getTrophyColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-yellow-600";
      default:
        return "text-gray-300";
    }
  };

  return (
<div className="h-full w-full bg-white text-gray-800 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div className="px-4 py-6 sm:px-0">
    <h1 className="text-4xl font-extrabold mb-8">Leaderboard</h1>
    <div className="flex justify-between mb-8">
      {topScores.map((score, index) => (
        <div key={score.id} className="w-72 border-2 border-gray-200 p-4 rounded-lg flex items-center justify-center transform hover:-translate-y-1 transition duration-300">
          <img src={score.icon} alt="Player Icon" className="w-16 h-16 rounded-full" />
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{score.name}</h2>
            <p className="text-lg">Score: {score.score}</p>
            <p className="text-lg">Lives left: {score.livesLeft}</p>
            <p className="text-lg">Retries: {score.retries}</p>
            <p className="text-lg">Time finished: {score.timeFinished}</p>
          </div>
        </div>
      ))}
    </div>
    <table className="table-auto w-full">
      <thead className="bg-white">
        <tr>
          <th className="px-4 py-2">Rank</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Score</th>
          <th className="px-4 py-2">Lives left</th>
          <th className="px-4 py-2">Retries</th>
          <th className="px-4 py-2">Time finished</th>
        </tr>
      </thead>
      <tbody>
        {otherScores.map((score, index) => (
          <tr key={score.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
            <td className="border border-gray-200 px-4 py-2">{index + 4}</td>
            <td className="border border-gray-200 px-4 py-2">{score.name}</td>
            <td className="border border-gray-200 px-4 py-2">{score.score}</td>
            <td className="border border-gray-200 px-4 py-2">{score.lives}</td>
            <td className="border border-gray-200 px-4 py-2">{score.retries}</td>
            <td className="border border-gray-200 px-4 py-2">{score.timeFinished}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default Leaderboard;
