-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletionReason" TEXT;

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");
