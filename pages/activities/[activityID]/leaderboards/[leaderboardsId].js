import {useRouter} from 'next/router';

function LeaderboardsPage() {
    const router = useRouter();
    const leaderboardsId = router.query.leaderboardsId
    return <h1>Leaderboards {leaderboardsId}</h1>;
}

export default LeaderboardsPage;