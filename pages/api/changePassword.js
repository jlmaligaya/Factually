// pages/api/changePassword.js

import { prisma } from "../../db";

export default async function handler(req, res) {
  const { currentPassword, newPassword, userId } = req.body;

  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { username: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the current password with the one stored in the database
    if (user.password !== currentPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update the user's password with the new one
    await prisma.user.update({
      where: { username: userId },
      data: { password: newPassword },
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
