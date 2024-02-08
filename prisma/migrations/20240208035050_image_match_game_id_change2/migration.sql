-- DropForeignKey
ALTER TABLE "ImageMatchPics" DROP CONSTRAINT "ImageMatchPics_gameID_fkey";

-- AddForeignKey
ALTER TABLE "ImageMatchPics" ADD CONSTRAINT "ImageMatchPics_gameID_fkey" FOREIGN KEY ("gameID") REFERENCES "ImageMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
