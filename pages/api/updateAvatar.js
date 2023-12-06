// pages/api/updateAvatar.js
import { getSession } from "next-auth/react";
import { prisma } from "../../db";

export default async function handler(req, res) {
  const session = await getSession({ req });

  const { username, avatar } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        username,
      },
      data: {
        avatar,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
