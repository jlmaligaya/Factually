/*
  Warnings:

  - You are about to drop the column `correctOption` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `optionFour` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `optionOne` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `optionThree` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `optionTwo` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `QuizQuestion` table. All the data in the column will be lost.
  - Added the required column `correct_option` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_four` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_one` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_three` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_two` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quiz_question` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activities" ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "correctOption",
DROP COLUMN "optionFour",
DROP COLUMN "optionOne",
DROP COLUMN "optionThree",
DROP COLUMN "optionTwo",
DROP COLUMN "question",
ADD COLUMN     "correct_option" TEXT NOT NULL,
ADD COLUMN     "option_four" TEXT NOT NULL,
ADD COLUMN     "option_one" TEXT NOT NULL,
ADD COLUMN     "option_three" TEXT NOT NULL,
ADD COLUMN     "option_two" TEXT NOT NULL,
ADD COLUMN     "quiz_question" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ImageMatch" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "activityID" TEXT NOT NULL,

    CONSTRAINT "ImageMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageMatchPics" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "gameID" INTEGER NOT NULL,

    CONSTRAINT "ImageMatchPics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageMatch" ADD CONSTRAINT "ImageMatch_activityID_fkey" FOREIGN KEY ("activityID") REFERENCES "Activities"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageMatchPics" ADD CONSTRAINT "ImageMatchPics_gameID_fkey" FOREIGN KEY ("gameID") REFERENCES "ImageMatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
