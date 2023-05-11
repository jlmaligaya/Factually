/*
  Warnings:

  - You are about to drop the column `aid` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `Score` table. All the data in the column will be lost.
  - Added the required column `activityId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "aid",
DROP COLUMN "uid",
ADD COLUMN     "activityId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
