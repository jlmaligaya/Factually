// pages/api/progression.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const uid = req.query.uid;
    const user = await prisma.user.findUnique({
      where: {
        uid,
      },
      select: {
        section_handled: true,
      },
    });

    const progression = await prisma.score.findMany({
      where: {
        user: {
          section: {
            in: user.section_handled,
          },
        },
      },
      include: {
        activity: true,
        user: true,
      },
    });

    res.status(200).json(progression);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
