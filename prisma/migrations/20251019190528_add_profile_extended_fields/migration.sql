/*
  Warnings:

  - You are about to drop the column `location` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "location",
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "googlePlaceId" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "streetNumber" TEXT,
ADD COLUMN     "surname" TEXT,
ADD COLUMN     "tiktokUrl" TEXT,
ADD COLUMN     "town" TEXT;
