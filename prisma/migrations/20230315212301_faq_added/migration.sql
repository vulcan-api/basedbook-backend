-- CreateTable
CREATE TABLE "Faq" (
    "Id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "isAnswered" BOOLEAN NOT NULL DEFAULT false,
    "askerId" INTEGER NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_askerId_fkey" FOREIGN KEY ("askerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
