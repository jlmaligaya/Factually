/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "uid" DROP DEFAULT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Scores" ADD CONSTRAINT "Scores_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION;