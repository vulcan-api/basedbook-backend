/*
  Warnings:

  - You are about to drop the column `userProjectId` on the `User` table. All the data in the column will be lost.
  - The `avatar` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userProjectId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userProjectId",
DROP COLUMN "avatar",
ADD COLUMN     "avatar" BYTEA;

-- AlterTable
ALTER TABLE "UserProject" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
