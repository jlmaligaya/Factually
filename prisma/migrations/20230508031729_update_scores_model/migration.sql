/*
  Warnings:

  - You are about to drop the `Scores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Scores" DROP CONSTRAINT "Scores_uid_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uid" SET DEFAULT ('UID'::text || lpad((nextval('activities_id_seq'::regclass))::text, 6, '0'::text));

-- DropTable
DROP TABLE "Scores";
