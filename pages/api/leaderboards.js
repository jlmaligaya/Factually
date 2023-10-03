import { prisma } from "../../db";

export default async function handler(req, res) {
  try {
    const activityID = req.query.activityID;
    const scoresWithUsername = await prisma.score.findMany({
      where: { activityId: activityID },
      orderBy: [
        { score: 'desc' }, // Order by score in descending order
        { timeFinished: 'asc' }, // Then order by timeFinished in ascending order
      ],

      take: 10,
      include: {
        user: {
          select: {
            username: true, // Include the username field
          },
        },
      },
    });

    if (!scoresWithUsername) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    res.status(200).json(scoresWithUsername);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
