import { prisma } from "../../db";

// Define API route to fetch quiz questions
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Access query parameter from req object directly
      const activityId = req.query.activityId;
      const sectionId = req.query.sectionId;

      let imageMatchData = await prisma.ImageMatch.findMany({
        where: { activityID: activityId, section: sectionId }, // Adjust the filter conditions as needed
        include: {
          images: true,
        },
      });

      if (imageMatchData.length === 0) {
        imageMatchData = await prisma.ImageMatch.findMany({
          where: { activityID: activityId, section: "default" }, // Adjust the filter conditions as needed
          include: {
            images: true,
          },
        });
      }
      // Return response
      console.log("API Reached");
      res.status(200).json(imageMatchData);
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
