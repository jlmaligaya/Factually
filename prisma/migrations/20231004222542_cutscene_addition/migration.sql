/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `livesLeft` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `retries` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `timeLeft` on the `Score` table. All the data in the column will be lost.
  - Added the required column `timeFinished` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "createdAt",
DROP COLUMN "livesLeft",
DROP COLUMN "retries",
DROP COLUMN "timeLeft",
ADD COLUMN     "timeFinished" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "CutscenePics" (
    "id" SERIAL NOT NULL,
    "activityID" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "isIntro" BOOLEAN NOT NULL,

    CONSTRAINT "CutscenePics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CutscenePics" ADD CONSTRAINT "CutscenePics_activityID_fkey" FOREIGN KEY ("activityID") REFERENCES "Activities"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;
