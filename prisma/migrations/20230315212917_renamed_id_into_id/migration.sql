/*
  Warnings:

  - The primary key for the `Faq` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `Faq` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Faq" DROP CONSTRAINT "Faq_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Faq_pkey" PRIMARY KEY ("id");
