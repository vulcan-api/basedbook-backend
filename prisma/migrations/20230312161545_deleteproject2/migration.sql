-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
