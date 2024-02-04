// In your API route file (e.g., api/submitImageMatch.js)
import { prisma } from "../../db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { formattedData, sectionId, activityId } = req.body;

  try {
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
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
