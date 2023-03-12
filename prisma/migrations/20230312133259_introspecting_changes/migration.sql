/*
  Warnings:

  - Made the column `projectId` on table `UserProject` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `UserProject` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_userId_fkey";

-- AlterTable
ALTER TABLE "UserProject" ALTER COLUMN "projectId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "SpottedComment" (
    "Id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "spottedPostId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpottedComment_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottedComment" ADD CONSTRAINT "SpottedComment_spottedPostId_fkey" FOREIGN KEY ("spottedPostId") REFERENCES "SpottedPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottedComment" ADD CONSTRAINT "SpottedComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
