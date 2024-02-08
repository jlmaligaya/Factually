/*
  Warnings:

  - Changed the type of `gameID` on the `ImageMatchPics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ImageMatchPics" DROP CONSTRAINT "ImageMatchPics_gameID_fkey";

-- DropIndex
DROP INDEX "ImageMatch_title_key";

-- AlterTable
ALTER TABLE "ImageMatch" ALTER COLUMN "title" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ImageMatchPics" DROP COLUMN "gameID",
ADD COLUMN     "gameID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ImageMatchPics" ADD CONSTRAINT "ImageMatchPics_gameID_fkey" FOREIGN KEY ("gameID") REFERENCES "ImageMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
