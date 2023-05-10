import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const router = useRouter();
  const activityId = req.query.id;
  

  if (req.method === "GET") {
    try {
      const activities = await prisma.activities.findUnique({
        where: { aid: "AID000002" },
        select: {
          questions: true,
        },
      });
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  }

if (req.method === "POST"){
  
  const data = JSON.parse(req.body);
  console.log(data)
  const result = await prisma.scores.create({
    data
  })

  res.json(result)
}
}