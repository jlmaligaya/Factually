import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prisma = new PrismaClient();

// Define API route to create or update a score
export default async function handler(req, res) {
  const { uid, aid, score, timeFinished } = req.body;

  try {
    if (req.method === "POST") {
      const existingScore = await prisma.score.findUnique({
        where: {
          userId_activityId: `${uid}_${aid}`,
        },
      });

      if (existingScore) {
        // If there is an existing score, check if the new score or timeFinished is better
        if (score >= existingScore.score) {
          // If either the score or timeFinished is worse, do not update the score
          if (score === existingScore.score) {
            if (timeFinished >= existingScore.timeFinished) {
              res.status(200).json(existingScore);
            } else {
              const updatedScore = await prisma.score.update({
                where: {
                  userId_activityId: `${uid}_${aid}`,
                },
                data: {
                  score: parseInt(score),
                  timeFinished: parseInt(timeFinished),
                },
              });
              res.status(200).json(updatedScore);
            }
          } else {
            const updatedScore = await prisma.score.update({
              where: {
                userId_activityId: `${uid}_${aid}`,
              },
              data: {
                score: parseInt(score),
                timeFinished: parseInt(timeFinished),
              },
            });
            res.status(200).json(updatedScore);
          }
        } else {
          res.status(200).json(existingScore);
        }
      } else {
        // No existing score, create a new score
        const newScore = await prisma.score.create({
          data: {
            userId: uid,
            activityId: aid,
            score: parseInt(score),
            timeFinished: parseInt(timeFinished),
            userId_activityId: `${uid}_${aid}`,
          },
        });
        res.status(200).json(newScore);
      }
    } else if (req.method === "GET") {
      // Access query parameter from req object directly
      const activityId = req.query.activityId;

      const scores = await prisma.score.findMany({
        where: { activityId },
        orderBy: [{ score: "desc" }, { timeFinished: "asc" }], // Order by score (descending) and timeFinished (ascending)
        include: { user: true },
        take: 10,
      });

      // Return response
      res.status(200).json(scores);
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
