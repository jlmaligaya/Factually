import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define API route to create or update a score
export default async function handler(req, res) {
  const { uid, aid, score, retries, timeLeft, livesLeft } = req.body;

  try {
    if (req.method === 'POST') {
      const existingScore = await prisma.score.findUnique({
        where: {
          userId_activityId: `${uid}_${aid}`,
        },
      });

      if (existingScore && score < existingScore.score) {
        // If the new score is lower than the existing score, do not update it.
        res.status(200).json(existingScore);
      } else {
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

        // Return response
        res.status(200).json(updatedScore);
      }
    } else if (req.method === 'GET') {
      // Access query parameter from req object directly
      const activityId = req.query.activityId;

      const scores = await prisma.score.findMany({
        where: { activityId },
        orderBy: { score: 'desc' },
        include: { user: true },
        take: 10,
      });

      // Return response
      res.status(200).json(scores);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
