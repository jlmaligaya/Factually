// pages/api/users/saveStudents.js
import { prisma } from "../../../db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { data, sectionId, uid } = req.body;

  try {
    // Check if the section exists, if not, create it
    let section = await prisma.section.findUnique({
      where: { sectionId },
    });

    if (!section) {
      section = await prisma.section.create({
        data: { sectionId },
      });
    }

    // Update section_handled of the current user
    await prisma.user.update({
      where: { uid: uid },
      data: { section_handled: { push: sectionId } },
    });

    // Save the students with the sectionId
    await Promise.all(
      data.map(async (student) => {
        // Check if the user already exists based on email
        const existingUser = await prisma.user.findUnique({
          where: { email: student[2] },
        });

        // If user does not exist, create a new user
        if (!existingUser) {
          await prisma.user.create({
            data: {
              firstName: student[0],
              lastName: student[1],
              email: student[2],
              password: "changeme",
              role: "student",
              section: sectionId,
            },
          });
        }
      })
    );

    return res.status(200).json({ message: "Students saved successfully" });
  } catch (error) {
    console.error("Error saving students:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
