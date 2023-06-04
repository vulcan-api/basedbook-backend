-- CreateTable
CREATE TABLE "UserTotpSecret" (
    "userId" INTEGER NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "UserTotpSecret_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserTotpSecret" ADD CONSTRAINT "UserTotpSecret_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
