import { prisma } from "../../db"

export default async function handler(req, res) {
  try {
    const activityID = req.query.activityID
    const introduction = await prisma.activities.findUnique({
      where: {
        aid: activityID, // Replace this with the actual activity ID
      },
    })

    if (!introduction) {
      res.status(404).json({ error: 'Video not found' })
      return
    }

    res.status(200).json(introduction)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
