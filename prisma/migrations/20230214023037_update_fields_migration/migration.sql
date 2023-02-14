/*
  Warnings:

  - You are about to drop the column `achv_1` on the `Achievements` table. All the data in the column will be lost.
  - You are about to drop the column `achv_2` on the `Achievements` table. All the data in the column will be lost.
  - You are about to drop the column `achv_3` on the `Achievements` table. All the data in the column will be lost.
  - You are about to drop the column `achv_4` on the `Achievements` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Achievements` table. All the data in the column will be lost.
  - The primary key for the `Activities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Activities` table. All the data in the column will be lost.
  - Added the required column `tid` to the `Achievements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aid` to the `Activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `Activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quiz` to the `Activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video` to the `Activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Achievements_uid_key";

-- AlterTable
ALTER TABLE "Achievements" DROP COLUMN "achv_1",
DROP COLUMN "achv_2",
DROP COLUMN "achv_3",
DROP COLUMN "achv_4",
DROP COLUMN "level",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "retries" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Activities" DROP CONSTRAINT "Activities_pkey",
DROP COLUMN "id",
ADD COLUMN     "aid" TEXT NOT NULL,
ADD COLUMN     "img" TEXT NOT NULL,
ADD COLUMN     "quiz" TEXT NOT NULL,
ADD COLUMN     "video" TEXT NOT NULL,
ADD CONSTRAINT "Activities_pkey" PRIMARY KEY ("aid");
