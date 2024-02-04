import { prisma } from "../../db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { sectionId, activityId } = req.query; // Get sectionId and activityId from query parameters

      // Fetch swipers based on the provided activityId and sectionId
      const swipers = await prisma.swiper.findMany({
        where: {
          activityId: activityId,
          section: sectionId,
        },
      });
      console.log("API: ", activityId);
      res.status(200).json(swipers);
    } else if (req.method === "POST") {
      const { activityId, swipers, sectionId } = req.body;

      // Delete existing swipers for the given activity and section
      await prisma.swiper.deleteMany({
        where: {
          activityId: activityId,
          section: sectionId,
        },
      });

      // Create an array to store the created swipers
      const createdSwipers = [];

      // Iterate over each swiper and create it in the database
      for (const swiperData of swipers) {
        const createdSwiper = await prisma.swiper.create({
          data: {
            activityId: activityId,
            correct_option: swiperData.correct_option,
            option_one: swiperData.option_one,
            option_two: swiperData.option_two,
            imageUrl: swiperData.imageUrl,
            description: swiperData.description,
            topic_name: swiperData.topic_name,
            section: sectionId,
          },
        });
        createdSwipers.push(createdSwiper);
      }

      res.status(201).json(createdSwipers); // Return the created swipers
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
