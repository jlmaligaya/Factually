/*
  Warnings:

  - A unique constraint covering the columns `[userId_activityId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId_activityId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "userId_activityId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Score_userId_activityId_key" ON "Score"("userId_activityId");
