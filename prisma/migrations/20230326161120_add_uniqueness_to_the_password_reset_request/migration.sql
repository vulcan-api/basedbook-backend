/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PasswordResetRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetRequest_userId_key" ON "PasswordResetRequest"("userId");
