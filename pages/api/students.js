import { useSession } from "next-auth/react";
import { prisma } from "../../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Get the session to determine the role of the user making the request
      const { sections } = req.query;
      const sectionsArray = JSON.parse(sections);
      console.log("Student API Reached");
      // Find users who are students and have sections within the instructor's section_handled
      const users = await prisma.user.findMany({
        where: {
          role: "student",
          section: {
            in: sectionsArray,
          },
        },
        select: {
          id: true,
          uid: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
          section: true,
        },
        orderBy: {
          section: "asc",
        },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
