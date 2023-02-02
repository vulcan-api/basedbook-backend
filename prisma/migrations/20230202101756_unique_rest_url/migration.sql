/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `RestURL` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RestURL_url_key" ON "RestURL"("url");
