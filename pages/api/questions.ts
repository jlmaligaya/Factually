import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const activityId = req.query.id;

  if (req.method === "GET") {
    try {
      const activity = await prisma.activities.findUnique({
        where: { id: activityId },
        select: {
          questions: true,
        },
      });

      res.status(200).json(activity);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch quiz questions" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
