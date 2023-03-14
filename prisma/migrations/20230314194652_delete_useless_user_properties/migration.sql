/*
  Warnings:

  - You are about to drop the column `postsProjects` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileSettings` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "postsProjects",
DROP COLUMN "profileSettings";
