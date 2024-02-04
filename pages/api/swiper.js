import { prisma } from "../../db";

// Define API route to fetch swiper questions
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Access query parameters from req object directly
      const { activityId, sectionName } = req.query;

      let swiperQuestions;

      if (sectionName) {
        // If sectionName is provided, fetch swiper questions for that section
        swiperQuestions = await prisma.swiper.findMany({
          where: {
            activityId: activityId,
            section: sectionName,
          },
        });
      } else {
        // If sectionName is not provided, fetch swiper questions without filtering by section
        swiperQuestions = await prisma.swiper.findMany({
          where: {
            activityId: activityId,
            section: "default",
          },
        });
      }

      // Return response
      res.status(200).json(swiperQuestions);
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
