import { PrismaClient } from '@prisma/client'
import { useRouter } from 'next/router'
// Initialize Prisma client
const prisma = new PrismaClient()

// Define API route to create or update a score
export default async function handler(req, res) {
  const { uid, aid, score, retries, timeLeft, livesLeft } = req.body;
  
  try {
    if (req.method === "POST") {
      const updatedScore = await prisma.score.upsert({
        where: {
          userId_activityId: `${uid}_${aid}`,
        },
        update: {
          score,
          retries,
          timeLeft,
          livesLeft,
        },
        create: {
          userId: uid,
          activityId: aid,
          score,
          retries,
          timeLeft,
          livesLeft,
          userId_activityId: `${uid}_${aid}`,
        },
        
      });
      res.status(200).json(updatedScore)

      //Bale okay na yung nasa taas dito lang yung problema di ko alam anong di ko ginagawang tama pero pag ginawa ko naman yung prisma statement na hardcoded directly may nababasa naman kaso isa nga lang kasi isa pa lang talaga HAHAXHAXHAXHAXH
    } else if (req.method === "GET") {
      const router = useRouter();
     const activityId = router.query.activityId;

      const scores = await prisma.score.findMany({ //Eto yung statement gumana yan
        where: { activityId},
        orderBy: { score: 'desc'},
        include: { user: true },
        take: 10,
      });

      res.status(200).json(scores)
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
