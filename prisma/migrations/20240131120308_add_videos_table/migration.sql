-- AlterTable
ALTER TABLE "ImageMatch" ADD COLUMN     "section" TEXT;

-- AlterTable
ALTER TABLE "QuizQuestion" ADD COLUMN     "section" TEXT;

-- AlterTable
ALTER TABLE "Swiper" ADD COLUMN     "section" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET DEFAULT ('FACTER'::text || lpad((nextval('user_id_seq'::regclass))::text, 6, '0'::text)),
ALTER COLUMN "uid" SET DEFAULT ('UID'::text || lpad((nextval('user_id_seq'::regclass))::text, 6, '0'::text));

-- CreateTable
CREATE TABLE "CustomizedVideo" (
    "id" SERIAL NOT NULL,
    "videoId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "sections" TEXT[],
    "videoFile" TEXT NOT NULL,

    CONSTRAINT "CustomizedVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomizedVideo_videoId_key" ON "CustomizedVideo"("videoId");

-- AddForeignKey
ALTER TABLE "CustomizedVideo" ADD CONSTRAINT "CustomizedVideo_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activities"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;
