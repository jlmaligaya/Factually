import { prisma } from "../../db";

export default async function handler(req, res) {
  const { isIntro, activityID } = req.query;
  try {
    const isIntroBool = isIntro === "true";
    const cutscene = await prisma.cutscenePics.findMany({
      where: {
        isIntro: isIntroBool,
        activityID: String(activityID),
      },
    });
    console.log("Data: ", cutscene);
    console.log("isIntro: ", isIntroBool);
    if (!cutscene) {
      res.status(404).json({ error: "Video not found" });
      return;
    }

    res.status(200).json(cutscene);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
