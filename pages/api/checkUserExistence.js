import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    const { username, email } = req.body;

    // Check if the username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      return res.status(200).json({
        exists: true,
        username: existingUser.username,
        email: existingUser.email,
      });
    }

    res.status(200).json({ exists: false });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
