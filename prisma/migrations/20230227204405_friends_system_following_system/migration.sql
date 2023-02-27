/*
  Warnings:

  - You are about to drop the `Friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_friendId_fkey";

-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_friendInvitedId_fkey";

-- DropTable
DROP TABLE "Friends";

-- CreateTable
CREATE TABLE "Follows" (
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerId","followingId")
);

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
