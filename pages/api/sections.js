// pages/api/sections.js

import { prisma } from "../../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const userId = req.query.userId;
    try {
      // Find the user by userId
      const user = await prisma.user.findUnique({
        where: {
          uid: userId,
        },
        select: {
          section_handled: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get the sections that the user is handling
      const sections = await prisma.section.findMany({
        where: {
          sectionId: {
            in: user.section_handled,
          },
        },
        orderBy: {
          sectionId: "asc",
        },
      });

      res.status(200).json(sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    const { sectionId } = req.body;
    const newSection = await prisma.section.create({
      data: {
        sectionId,
      },
    });
    res.status(201).json(newSection);
  } else if (req.method === "DELETE") {
    const { sectionId } = req.body;
    try {
      await prisma.section.delete({
        where: {
          sectionId: "sectionId",
        },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Error deleting section" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
