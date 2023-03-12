-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
