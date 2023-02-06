/*
  Warnings:

  - Added the required column `isVerified` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "UnverifiedUser" (
    "tempId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UnverifiedUser_pkey" PRIMARY KEY ("tempId")
);

-- AddForeignKey
ALTER TABLE "UnverifiedUser" ADD CONSTRAINT "UnverifiedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
