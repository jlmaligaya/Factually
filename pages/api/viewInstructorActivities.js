// pages/api/activities.js
import { prisma } from "../../db";

export default async function handler(req, res) {
  try {
    const activities = await prisma.activities.findMany({
      orderBy: { id: "asc" }, // Sort activities by ID in ascending order
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
}
