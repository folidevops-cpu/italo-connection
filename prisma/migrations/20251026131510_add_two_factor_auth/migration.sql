-- AlterTable
ALTER TABLE "users" ADD COLUMN     "twoFactorExpiry" TIMESTAMP(3),
ADD COLUMN     "twoFactorSecret" TEXT;
