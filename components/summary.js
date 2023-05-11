import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'



export default function Leaderboard ({scores}) {
  const topScores = scores.slice(0, 3); // Get the other 3 scores for the pabibo top 3
  const otherScores = scores.slice(3); // Get the other scores like the hampaslupa they should be

  // !!Yung idea dito is to populate the rest of the 10 rows since isa nga lang yung score pa pero ayon feel free to make 10 accounts and do 1 activity tinatamad na ako itry
  // while (otherScores.length < 10) {
  //   otherScores.push({ id: otherScores.length + 1, name: '', score: '', livesLeft: '', retries: '', timeFinished: '' });
  // }



  return (
<div className="h-full w-full bg-white text-gray-800 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div className="px-4 py-6 sm:px-0">
    <h1 className="text-4xl font-extrabold mb-8">Leaderboard</h1>
    <div className="flex justify-between mb-8">
      {topScores.map((score, index) => (
        <div key={score.id} className="w-72 border-2 border-gray-200 p-4 rounded-lg flex items-center justify-center transform hover:-translate-y-1 transition duration-300">
          <img src={score.icon} alt="Player Icon" className="w-16 h-16 rounded-full" />
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{score.userId}</h2>
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
            <td className="border border-gray-200 px-4 py-2">{score.userId}</td>
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

  
  const activityID = context.query.activityID; //Bale eto yung activity id na gagamitin natin identifier

  const { data: scores } = await axios.get(`/api/scores?activityID=${activityID}`); //Sundan mo na lang yung api feeling ko don may mali o ewan ko.
  console.log(scores) //Triny ko i-log para lang tignan kung may laman ewan ko wala lumalabas
  return {
    props: {
      scores
    }
  };
}

