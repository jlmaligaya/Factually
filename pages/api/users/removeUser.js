import { prisma } from "../../../db";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { userId, uid } = req.query;

    try {
      // Find and delete scores associated with the user
      await prisma.score.deleteMany({ where: { userId: uid } });

      // Delete the user
      await prisma.user.delete({ where: { id: parseInt(userId) } });

      res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove user" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
