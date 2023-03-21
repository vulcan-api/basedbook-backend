-- DropForeignKey
ALTER TABLE "Faq" DROP CONSTRAINT "Faq_askerId_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "GroupAdmin" DROP CONSTRAINT "GroupAdmin_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupAdmin" DROP CONSTRAINT "GroupAdmin_userId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMember" DROP CONSTRAINT "GroupMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "GroupPost" DROP CONSTRAINT "GroupPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "SpottedComment" DROP CONSTRAINT "SpottedComment_spottedPostId_fkey";

-- DropForeignKey
ALTER TABLE "SpottedComment" DROP CONSTRAINT "SpottedComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "UnverifiedUser" DROP CONSTRAINT "UnverifiedUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_restURLId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkils" DROP CONSTRAINT "UserSkils_skillId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkils" DROP CONSTRAINT "UserSkils_userId_fkey";

-- AlterTable
ALTER TABLE "Faq" ALTER COLUMN "askerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "newsLetter" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_restURLId_fkey" FOREIGN KEY ("restURLId") REFERENCES "RestURL"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkils" ADD CONSTRAINT "UserSkils_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkils" ADD CONSTRAINT "UserSkils_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnverifiedUser" ADD CONSTRAINT "UnverifiedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupAdmin" ADD CONSTRAINT "GroupAdmin_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupAdmin" ADD CONSTRAINT "GroupAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupPost" ADD CONSTRAINT "GroupPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottedComment" ADD CONSTRAINT "SpottedComment_spottedPostId_fkey" FOREIGN KEY ("spottedPostId") REFERENCES "SpottedPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpottedComment" ADD CONSTRAINT "SpottedComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_askerId_fkey" FOREIGN KEY ("askerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
