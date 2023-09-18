-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "optionOne" TEXT NOT NULL,
    "optionTwo" TEXT NOT NULL,
    "optionThree" TEXT NOT NULL,
    "optionFour" TEXT NOT NULL,
    "correctOption" INTEGER NOT NULL,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;
