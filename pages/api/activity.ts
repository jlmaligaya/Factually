import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";


const prisma = new PrismaClient();

export default async function handle(req, res) {
    const router = useRouter()
    const activityId = req.query.id;
    console.log(activityId)

  if (req.method === "GET") {
        const activities = await prisma.activities.findUnique({
            where: { aid: "AID000002" },
            select: {
              questions: true,
            },
          });
          res.json(activities)
        }
    }