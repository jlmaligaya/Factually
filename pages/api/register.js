import { error } from 'console';
import { prisma } from '../../db';



export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, username, password  } = req.body;

    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          username,
          password,
        },
      });

      console.log('User registered successfully', user);

      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    console.error(error)
    res.status(405).end();
  }
}
