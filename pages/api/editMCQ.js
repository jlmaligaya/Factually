import { prisma } from "../../db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { sectionId, activityId } = req.query; // Get sectionId and activityId from query parameters

      // Fetch questions based on the provided activityId and sectionId
      const questions = await prisma.quizQuestion.findMany({
        where: {
          activityId: activityId,
          section: sectionId,
        },
      });
      console.log("API: ", activityId);
      res.status(200).json(questions);
    } else if (req.method === "POST") {
      const { activityId, questions, sectionId } = req.body;

      // Delete existing questions for the given activity and section
      await prisma.quizQuestion.deleteMany({
        where: {
          activityId: activityId,
          section: sectionId,
        },
      });

      // Create an array to store the created quiz questions
      const createdQuestions = [];

      // Iterate over each question and create it in the database
      for (const questionData of questions) {
        const createdQuestion = await prisma.quizQuestion.create({
          data: {
            activityId: activityId,
            correct_option: questionData.correct_option,
            option_one: questionData.option_one,
            option_two: questionData.option_two,
            option_three: questionData.option_three,
            option_four: questionData.option_four,
            quiz_question: questionData.quiz_question,
            topic_name: questionData.topic_name,
            section: sectionId,
          },
        });
        createdQuestions.push(createdQuestion);
      }

      res.status(201).json(createdQuestions); // Return the created questions
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
