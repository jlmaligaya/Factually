import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === "POST") {
    const { firstName, lastName, username, email, password } = req.body;

    // Check if the username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      return res.status(422).json({
        message: "Username or email already exists",
        errors: {
          username: "Username already exists",
          email: "Email already exists",
        },
      });
    }

    try {
      // Continue with user creation if no existing user found
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          password,
        },
      });

      res
        .status(200)
        .json({ message: "User created successfully!", user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
