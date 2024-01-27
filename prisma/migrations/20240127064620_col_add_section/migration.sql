/*
  Warnings:

  - You are about to drop the column `exp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activities" ADD COLUMN     "section" TEXT;

-- AlterTable
ALTER TABLE "ImageMatch" ADD COLUMN     "topic_name" TEXT;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "topic_name" TEXT;

-- AlterTable
ALTER TABLE "Swiper" ADD COLUMN     "description" TEXT,
ADD COLUMN     "topic_name" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "exp",
DROP COLUMN "level",
ADD COLUMN     "avatar" TEXT DEFAULT '0',
ADD COLUMN     "role" TEXT,
ADD COLUMN     "section" TEXT;

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_sectionId_key" ON "Section"("sectionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_section_fkey" FOREIGN KEY ("section") REFERENCES "Section"("sectionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activities" ADD CONSTRAINT "Activities_section_fkey" FOREIGN KEY ("section") REFERENCES "Section"("sectionId") ON DELETE SET NULL ON UPDATE CASCADE;
