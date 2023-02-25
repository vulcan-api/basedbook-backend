-- CreateTable
CREATE TABLE "Olympics" (
    "id" SERIAL NOT NULL,
    "registrationEnd" TIMESTAMP(3) NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prizePool" INTEGER NOT NULL,
    "organisators" TEXT[],

    CONSTRAINT "Olympics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OlympicsToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OlympicsToUser_AB_unique" ON "_OlympicsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OlympicsToUser_B_index" ON "_OlympicsToUser"("B");

-- AddForeignKey
ALTER TABLE "_OlympicsToUser" ADD CONSTRAINT "_OlympicsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Olympics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OlympicsToUser" ADD CONSTRAINT "_OlympicsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
