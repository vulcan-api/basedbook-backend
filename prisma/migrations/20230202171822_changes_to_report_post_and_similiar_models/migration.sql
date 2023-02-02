/*
  Warnings:

  - You are about to drop the column `postId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_postId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "postId",
ADD COLUMN     "projectId" INTEGER,
ADD COLUMN     "spottedPostId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userProjectId" INTEGER;

-- DropTable
DROP TABLE "Post";

-- DropEnum
DROP TYPE "Category";

-- CreateTable
CREATE TABLE "SpottedPost" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "like" INTEGER NOT NULL DEFAULT 0,
    "dislike" INTEGER NOT NULL DEFAULT 0,
    "isAnonymous" BOOLEAN NOT NULL,

    CONSTRAINT "SpottedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProject" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userProjectId_fkey" FOREIGN KEY ("userProjectId") REFERENCES "UserProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottedPost" ADD CONSTRAINT "SpottedPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_spottedPostId_fkey" FOREIGN KEY ("spottedPostId") REFERENCES "SpottedPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
