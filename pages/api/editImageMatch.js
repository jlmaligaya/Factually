// Import Prisma and other necessary modules
import { prisma } from "../../db";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { sectionId, activityId } = req.query;

      // Fetch existing questions for the given activity and section
      const existingQuestions = await prisma.imageMatch.findMany({
        where: {
          activityID: activityId,
          section: sectionId,
        },
        select: {
          images: true,
        },
      });

      res.status(200).json(existingQuestions);
    } else if (req.method === "POST") {
      const { formattedData, sectionId, activityId } = req.body;

      // Delete existing image matches for the given activity and section
      await prisma.imageMatch.deleteMany({
        where: {
          activityID: activityId,
          section: sectionId,
        },
      });

      // Iterate over the data array and save each ImageMatch object
      for (const item of formattedData) {
        const { title, images, topic_name } = item;

        await prisma.imageMatch.create({
          data: {
            title,
            activityID: activityId,
            topic_name,
            section: sectionId, // Assuming selectedSections is an array of section names
            images: {
              createMany: {
                data: images.map((image) => ({
                  url: image[0],
                  value: image[1],
                })),
              },
            },
          },
        });
      }

      res.status(200).json({ message: "Data submitted successfully" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
