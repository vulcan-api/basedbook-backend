-- AlterTable
ALTER TABLE "User" ADD COLUMN     "darkTheme" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "youtube" TEXT;
