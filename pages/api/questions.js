import { prisma } from "../../db"

// Define API route to fetch quiz questions
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Access query parameter from req object directly
      const activityId = req.query.activityId;

      const quizQuestions = await prisma.quizQuestion.findMany({
        where: { activityId: activityId }, // Adjust the filter conditions as needed
      });

      // Return response
      res.status(200).json(quizQuestions);
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
