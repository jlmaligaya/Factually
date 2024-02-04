// pages/api/users.js
import { prisma } from "../../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { sectionId } = req.query;
    const users = await prisma.user.findMany({
      where: { role: "student" },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        section: true,
      },
    });
    res.status(200).json(users);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
