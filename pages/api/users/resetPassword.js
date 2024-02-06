// pages/api/users/resetPassword.js
import bcrypt from "bcrypt";

import { prisma } from "../../../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId } = req.body;

    try {
      // Implement logic to reset the user's password
      const hashedPassword = await bcrypt.hash("changeme", 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }, // Update with the new password
      });

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset password" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
