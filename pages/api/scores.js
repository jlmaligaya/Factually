import { PrismaClient } from '@prisma/client'

// Initialize Prisma client
const prisma = new PrismaClient()

// Define API route to create a new score
export default async function handler(req, res) {
  const { activityId, userId, score, retries, timeLeft, livesLeft } = req.body

  try {
    // Create a new score entry in the database
    const newScore = await prisma.score.create({
      data: {
        activityId,
        userId,
        score,
        retries,
        timeLeft,
        livesLeft,
      },
    })

    // Send success response with the new score object
    res.status(200).json(newScore)
  } catch (error) {
    console.error(error)

    // Send error response with error message
    res.status(500).json({ message: 'Failed to create score' })
  }
}
