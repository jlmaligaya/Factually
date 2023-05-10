import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { uid, aid, score, retries, timeLeft, livesLeft } = req.body;

    try {
      const newScore = await prisma.score.create({
        data: {
          user: {
            connect: {
              uid,
            },
          },
          activity: {
            connect: {
              aid,
            },
          },

          score,
          retries,
          timeLeft,
          livesLeft,
        },
      });

      res.status(200).json(newScore);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create score." });
    }
  }
}
