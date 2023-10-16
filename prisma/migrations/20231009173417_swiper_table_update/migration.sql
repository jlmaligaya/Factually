/*
  Warnings:

  - Added the required column `imageUrl` to the `Swiper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Swiper" ADD COLUMN     "imageUrl" TEXT NOT NULL;
