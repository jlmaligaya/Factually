import { prisma } from "../../db"
import { useRouter } from "next/router";

export default async function handler(req, res) {
  try {
    
    const activityID = req.query.activityID
    const scores = await prisma.score.findMany({
      where: { activityId: activityID},
      orderBy: { score: 'desc' },
      take: 10,
    });

    if (!scores) {
      res.status(404).json({ error: 'Video not found' })
      return
    }

    res.status(200).json(scores)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
