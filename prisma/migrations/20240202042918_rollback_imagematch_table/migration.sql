/*
  Warnings:

  - You are about to drop the `ImageMatchPics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImageMatchPics" DROP CONSTRAINT "ImageMatchPics_gameID_fkey";

-- AlterTable
ALTER TABLE "CustomizedVideo" ALTER COLUMN "videoId" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "ImageMatch" ADD COLUMN     "images" JSONB[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "section_handled" TEXT[];

-- DropTable
DROP TABLE "ImageMatchPics";
