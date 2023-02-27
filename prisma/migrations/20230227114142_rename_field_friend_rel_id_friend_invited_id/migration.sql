/*
  Warnings:

  - You are about to drop the column `friendRelId` on the `Friends` table. All the data in the column will be lost.
  - Added the required column `friendInvitedId` to the `Friends` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_friendRelId_fkey";

-- DropIndex
DROP INDEX "Friends_friendId_friendRelId_key";

-- AlterTable
ALTER TABLE "Friends"
RENAME COLUMN "friendRelId" TO "friendInvitedId";
ALTER TABLE "Friends"
ADD CONSTRAINT "Friends_pkey" PRIMARY KEY ("friendId", "friendInvitedId");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friendInvitedId_fkey" FOREIGN KEY ("friendInvitedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
