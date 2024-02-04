import { prisma } from "../../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, sectionHandled } = req.body;

    try {
      await prisma.user.update({
        where: { uid: userId },
        data: { section_handled: sectionHandled },
      });

      res.status(200).json({ message: "Sections updated successfully" });
    } catch (error) {
      console.error("Error updating user section handled:", error);
      res.status(500).json({ error: "Failed to update sections" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
