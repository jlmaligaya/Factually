// pages/api/change-username.js
import { getSession } from "next-auth/react";
import { prisma } from "../../db";
export default async function handler(req, res) {
  const session = await getSession({ req });

  const { newUsername, username } = req.body;

  try {
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
