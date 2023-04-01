/*
  Warnings:

  - A unique constraint covering the columns `[question]` on the table `Faq` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Faq_question_key" ON "Faq"("question");
