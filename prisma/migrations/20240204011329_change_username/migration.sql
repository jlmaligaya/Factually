-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET DEFAULT gen_random_uuid();
