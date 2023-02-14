/*
  Warnings:

  - You are about to drop the `Dislike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dislike" DROP CONSTRAINT "Dislike_groupPostId_fkey";

-- DropForeignKey
ALTER TABLE "Dislike" DROP CONSTRAINT "Dislike_postId_fkey";

-- DropForeignKey
ALTER TABLE "Dislike" DROP CONSTRAINT "Dislike_userId_fkey";

-- DropForeignKey
ALTER TABLE "Dislike" DROP CONSTRAINT "Dislike_userPostId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_groupPostId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userPostId_fkey";

-- DropTable
DROP TABLE "Dislike";

-- DropTable
DROP TABLE "Like";

-- CreateTable
CREATE TABLE "SpottedLikes" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SpottedLikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpottedLikes_userId_postId_key" ON "SpottedLikes"("userId", "postId");

-- AddForeignKey
ALTER TABLE "SpottedLikes" ADD CONSTRAINT "SpottedLikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SpottedPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottedLikes" ADD CONSTRAINT "SpottedLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
