// pages/api/sections.js

import { prisma } from "../../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const sections = await prisma.section.findMany();
    res.status(200).json(sections);
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
