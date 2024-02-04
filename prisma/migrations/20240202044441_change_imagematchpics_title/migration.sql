/*
  Warnings:

  - You are about to drop the column `gameID` on the `ImageMatchPics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `ImageMatch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imgTitle` to the `ImageMatchPics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImageMatchPics" DROP CONSTRAINT "ImageMatchPics_gameID_fkey";

-- AlterTable
ALTER TABLE "ImageMatch" ALTER COLUMN "title" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "ImageMatchPics" DROP COLUMN "gameID",
ADD COLUMN     "imgTitle" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ImageMatch_title_key" ON "ImageMatch"("title");

-- AddForeignKey
ALTER TABLE "ImageMatchPics" ADD CONSTRAINT "ImageMatchPics_imgTitle_fkey" FOREIGN KEY ("imgTitle") REFERENCES "ImageMatch"("title") ON DELETE RESTRICT ON UPDATE CASCADE;
