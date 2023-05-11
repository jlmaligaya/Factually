/*
  Warnings:

  - You are about to drop the column `activityId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Score` table. All the data in the column will be lost.
  - Added the required column `aid` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "activityId",
DROP COLUMN "userId",
ADD COLUMN     "aid" TEXT NOT NULL,
ADD COLUMN     "uid" TEXT NOT NULL;
