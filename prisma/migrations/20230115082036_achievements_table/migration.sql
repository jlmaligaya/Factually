/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Achievements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `achv_4` to the `Achievements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Achievements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Achievements` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Achievements] ADD [achv_4] BIT NOT NULL,
[level] INT NOT NULL,
[uid] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Achievements] ADD CONSTRAINT [Achievements_uid_key] UNIQUE NONCLUSTERED ([uid]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
