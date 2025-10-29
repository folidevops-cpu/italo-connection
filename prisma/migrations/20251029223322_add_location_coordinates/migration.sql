-- DropIndex
DROP INDEX "public"."listings_description_gin_idx";

-- DropIndex
DROP INDEX "public"."listings_title_gin_idx";

-- DropIndex
DROP INDEX "public"."services_description_gin_idx";

-- DropIndex
DROP INDEX "public"."services_location_gin_idx";

-- DropIndex
DROP INDEX "public"."services_name_gin_idx";

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
