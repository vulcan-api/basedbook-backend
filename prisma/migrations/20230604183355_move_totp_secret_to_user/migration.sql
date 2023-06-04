/*
  Warnings:

  - You are about to drop the `UserTotpSecret` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTotpSecret" DROP CONSTRAINT "UserTotpSecret_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totpSecret" TEXT;

-- DropTable
DROP TABLE "UserTotpSecret";
