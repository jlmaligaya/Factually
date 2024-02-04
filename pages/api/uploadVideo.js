import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
  const { videoId, activityId, sections, videoFile } = req.body;
  const prisma = new PrismaClient();
  try {
    let videoUpload;

    // Check if videoId already exists
    const existingVideo = await prisma.customizedVideo.findUnique({
      where: {
        videoId: videoId,
      },
    });

    if (existingVideo) {
      // If videoId exists, update the record
      videoUpload = await prisma.customizedVideo.update({
        where: {
          videoId: videoId,
        },
        data: {
          activityId,
          sections,
          videoFile, // Store the Storage object key
        },
      });
    } else {
      // If videoId doesn't exist, create a new record
      videoUpload = await prisma.customizedVideo.create({
        data: {
          videoId,
          activityId,
          sections,
          videoFile, // Store the Storage object key
        },
      });
    }

    res.status(200).json(videoUpload);
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
