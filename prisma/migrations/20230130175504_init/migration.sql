-- CreateTable
CREATE TABLE "UserInfo" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievements" (
    "id" TEXT NOT NULL,
    "achv_1" BOOLEAN NOT NULL,
    "achv_2" BOOLEAN NOT NULL,
    "achv_3" BOOLEAN NOT NULL,
    "achv_4" BOOLEAN NOT NULL,
    "level" INTEGER NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activities" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_email_key" ON "UserInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_uid_key" ON "Achievements"("uid");
