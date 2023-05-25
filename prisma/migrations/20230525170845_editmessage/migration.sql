-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "editTime" TIMESTAMP(3),
ADD COLUMN     "isEdited" BOOLEAN NOT NULL DEFAULT false;
