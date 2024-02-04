/*
  Warnings:

  - You are about to drop the column `imgTitle` on the `ImageMatchPics` table. All the data in the column will be lost.
  - Added the required column `gameID` to the `ImageMatchPics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImageMatchPics" DROP CONSTRAINT "ImageMatchPics_imgTitle_fkey";

-- AlterTable
ALTER TABLE "ImageMatchPics" DROP COLUMN "imgTitle",
ADD COLUMN     "gameID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ImageMatchPics" ADD CONSTRAINT "ImageMatchPics_gameID_fkey" FOREIGN KEY ("gameID") REFERENCES "ImageMatch"("title") ON DELETE RESTRICT ON UPDATE CASCADE;
