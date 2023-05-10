import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
  if (req.method === 'POST') {
    const { firstName, lastName, username, email, password } = req.body;

    try {
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          password,
        },
      });

      res.status(200).json({ message: 'User created successfully!', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
