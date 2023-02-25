/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId]` on the table `UserProject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserProject_userId_projectId_key" ON "UserProject"("userId", "projectId");
