/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Scores" DROP CONSTRAINT "Scores_uid_fkey";

CREATE SEQUENCE user_id_seq START 1;
CREATE SEQUENCE activities_id_seq START 1;

-- AlterTable
ALTER TABLE "Activities" ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "aid" SET DEFAULT ('AID'::text || lpad((nextval('activities_id_seq'::regclass))::text, 6, '0'::text)),
ALTER COLUMN "img" SET DEFAULT 'https://edukasyon-production.s3.amazonaws.com/uploads/facility/image/5321/j4d6loBhPR2zRk4gtnAB75GWqmq2ZXkr.jpg',
ADD CONSTRAINT "Activities_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ALTER COLUMN "uid" SET DEFAULT ('UID'::text || lpad((nextval('user_id_seq'::regclass))::text, 6, '0'::text)),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uid");

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "optionOne" TEXT NOT NULL,
    "optionTwo" TEXT NOT NULL,
    "optionThree" TEXT NOT NULL,
    "optionFour" TEXT NOT NULL,
    "correctOption" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);




-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
