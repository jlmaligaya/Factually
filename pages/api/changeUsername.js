import { getSession } from "next-auth/react";
import { prisma } from "../../db";

export default async function handler(req, res) {
  const session = await getSession({ req });

  const { newUsername, username } = req.body;

  try {
    // Check if the new username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: newUsername },
    });

    if (existingUser) {
      // If the new username already exists, return a specific error message
      return res.status(400).json({ error: "Username already exists" });
    }

    // Update the username if it doesn't exist
    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: { username: newUsername },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
