import { prisma } from "../../db";

// Define API route to fetch quiz questions
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Access query parameter from req object directly
      const { activityId, sectionName } = req.query;

      let quizQuestions = await prisma.quizQuestion.findMany({
        where: {
          activityId: activityId,
          section: sectionName, // Check if sectionName is provided, otherwise allow null
        },
      });

      // If no questions found for the specified section, fetch questions with null section
      if (quizQuestions.length === 0) {
        quizQuestions = await prisma.quizQuestion.findMany({
          where: { activityId: activityId, section: "default" },
        });
      }

      // Return response
      res.status(200).json(quizQuestions);
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
