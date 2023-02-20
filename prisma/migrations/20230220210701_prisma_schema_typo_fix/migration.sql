/*
  Warnings:

  - You are about to drop the column `name` on the `UserSkils` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `UserSkils` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserSkils` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSkils" DROP CONSTRAINT "UserSkils_usersId_fkey";

-- AlterTable
ALTER TABLE "UserSkils" DROP COLUMN "name",
DROP COLUMN "usersId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSkils" ADD CONSTRAINT "UserSkils_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
