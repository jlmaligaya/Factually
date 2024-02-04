/*
  Warnings:

  - You are about to drop the column `images` on the `ImageMatch` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `ImageMatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ImageMatch" DROP COLUMN "images",
DROP COLUMN "section";

-- CreateTable
CREATE TABLE "ImageMatchPics" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "gameID" INTEGER NOT NULL,

    CONSTRAINT "ImageMatchPics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageMatchPics" ADD CONSTRAINT "ImageMatchPics_gameID_fkey" FOREIGN KEY ("gameID") REFERENCES "ImageMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
