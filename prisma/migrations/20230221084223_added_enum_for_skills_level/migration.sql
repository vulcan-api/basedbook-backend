/*
  Warnings:

  - Added the required column `skillLvl` to the `UserSkils` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "enumSkillLvl" AS ENUM ('beginner', 'intermediate', 'advanced');

-- AlterTable
ALTER TABLE "UserSkils" ADD COLUMN     "skillLvl" "enumSkillLvl" NOT NULL;
