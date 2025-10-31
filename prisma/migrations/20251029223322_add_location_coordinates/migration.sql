-- DropIndex (if exists)
DROP INDEX IF EXISTS "public"."listings_description_gin_idx";

-- DropIndex (if exists)
DROP INDEX IF EXISTS "public"."listings_title_gin_idx";

-- DropIndex (if exists)
DROP INDEX IF EXISTS "public"."services_description_gin_idx";

-- DropIndex (if exists)
DROP INDEX IF EXISTS "public"."services_location_gin_idx";

-- DropIndex (if exists)
DROP INDEX IF EXISTS "public"."services_name_gin_idx";

-- AlterTable
ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;
