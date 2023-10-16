-- CreateTable
CREATE TABLE "Swiper" (
    "id" SERIAL NOT NULL,
    "activityId" TEXT NOT NULL,
    "correct_option" TEXT NOT NULL,
    "option_one" TEXT NOT NULL,
    "option_two" TEXT NOT NULL,

    CONSTRAINT "Swiper_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Swiper" ADD CONSTRAINT "Swiper_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;
