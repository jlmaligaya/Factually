/*
  Warnings:

  - The primary key for the `Activities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Achievements` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[aid]` on the table `Activities` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Activities" DROP CONSTRAINT "Activities_pkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "exp" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "level" SET DEFAULT 1;

-- DropTable
DROP TABLE "Achievements";

-- CreateTable
CREATE TABLE "Scores" (
    "id" TEXT NOT NULL,
    "tid" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scores_tid_key" ON "Scores"("tid");

-- CreateIndex
CREATE UNIQUE INDEX "Activities_aid_key" ON "Activities"("aid");

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION;
