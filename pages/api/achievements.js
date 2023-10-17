import { prisma } from "../../db";

// Define the API handler function
export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ message: "Method Not Allowed" });
      return;
    }

    const { uid } = req.query; // Assuming the query parameter is 'uid'

    const scores = await prisma.score.findMany({
      where: {
        userId: uid,
      },
      include: {
        activity: true,
      },
      orderBy: [
        { score: "desc" }, // Order by score in descending order
        { timeFinished: "asc" }, // Then order by timeFinished in ascending order
      ],
    });

    res.status(200).json(scores);
  } catch (error) {
    console.error("Error fetching user scores:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
