#!/bin/bash

# PostgreSQL Full-Text Search Setup Script
# This script enables full-text search extensions and creates indexes

echo "🔧 Setting up PostgreSQL Full-Text Search..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo "Please set DATABASE_URL in your .env file"
  exit 1
fi

# Run Prisma migration to update schema
echo "📦 Running Prisma migrations..."
npx prisma migrate dev --name add_search_indexes

# Apply the full-text search extensions and indexes
echo "🔍 Enabling PostgreSQL extensions..."
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS unaccent;"

echo "📊 Creating GIN indexes for full-text search..."
psql $DATABASE_URL -c "CREATE INDEX IF NOT EXISTS listings_title_gin_idx ON listings USING gin (title gin_trgm_ops);"
psql $DATABASE_URL -c "CREATE INDEX IF NOT EXISTS listings_description_gin_idx ON listings USING gin (description gin_trgm_ops);"
psql $DATABASE_URL -c "CREATE INDEX IF NOT EXISTS services_name_gin_idx ON services USING gin (name gin_trgm_ops);"
psql $DATABASE_URL -c "CREATE INDEX IF NOT EXISTS services_description_gin_idx ON services USING gin (description gin_trgm_ops);"
psql $DATABASE_URL -c "CREATE INDEX IF NOT EXISTS services_location_gin_idx ON services USING gin (location gin_trgm_ops);"

echo "✅ Full-text search setup complete!"
echo ""
echo "Next steps:"
echo "1. Test the search at /search page"
echo "2. Try searching for listings and services"
echo "3. Use filters to refine results"
