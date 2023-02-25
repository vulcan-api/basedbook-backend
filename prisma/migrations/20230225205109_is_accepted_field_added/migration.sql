/*
  Warnings:

  - You are about to drop the `_Friends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_A_fkey";

-- DropForeignKey
ALTER TABLE "_Friends" DROP CONSTRAINT "_Friends_B_fkey";

-- DropTable
DROP TABLE "_Friends";

-- CreateTable
CREATE TABLE "Friends" (
    "friendId" INTEGER NOT NULL,
    "friendRelId" INTEGER NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Friends_friendId_friendRelId_key" ON "Friends"("friendId", "friendRelId");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friendRelId_fkey" FOREIGN KEY ("friendRelId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
