// api/getVideoUrl.js
import { prisma } from "../../db";

export default async function handler(req, res) {
  const { sectionName, activityID } = req.query;

  try {
    // Find CustomizedVideo with matching activityID and sections containing sectionName
    const customizedVideo = await prisma.customizedVideo.findFirst({
      where: {
        activityId: activityID,
        sections: { has: sectionName },
      },
    });

    if (customizedVideo) {
      // If CustomizedVideo found, return its videoFile
      res.status(200).json({ videoURL: customizedVideo.videoFile });
    } else {
      // If no CustomizedVideo found, return default video path
      const defaultVideoURL = `/videos/${activityID}_default.mp4`;
      res.status(200).json({ videoURL: defaultVideoURL });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
