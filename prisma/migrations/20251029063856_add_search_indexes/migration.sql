-- DropIndex (only if they exist)
DROP INDEX IF EXISTS "public"."listings_description_gin_idx";

-- DropIndex
DROP INDEX IF EXISTS "public"."listings_title_gin_idx";

-- DropIndex
DROP INDEX IF EXISTS "public"."services_description_gin_idx";

-- DropIndex
DROP INDEX IF EXISTS "public"."services_location_gin_idx";

-- DropIndex
DROP INDEX IF EXISTS "public"."services_name_gin_idx";

-- CreateIndex
CREATE INDEX "listings_ownerId_idx" ON "listings"("ownerId");

-- CreateIndex
CREATE INDEX "listings_status_idx" ON "listings"("status");

-- CreateIndex
CREATE INDEX "listings_type_idx" ON "listings"("type");

-- CreateIndex
CREATE INDEX "listings_createdAt_idx" ON "listings"("createdAt");

-- CreateIndex
CREATE INDEX "services_ownerId_idx" ON "services"("ownerId");

-- CreateIndex
CREATE INDEX "services_status_idx" ON "services"("status");

-- CreateIndex
CREATE INDEX "services_serviceTypeId_idx" ON "services"("serviceTypeId");

-- CreateIndex
CREATE INDEX "services_createdAt_idx" ON "services"("createdAt");
