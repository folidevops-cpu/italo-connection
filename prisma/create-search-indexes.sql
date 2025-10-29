-- Create GIN indexes for full-text search on listings
CREATE INDEX IF NOT EXISTS listings_title_gin_idx ON listings USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS listings_description_gin_idx ON listings USING gin (description gin_trgm_ops);

-- Create GIN indexes for full-text search on services
CREATE INDEX IF NOT EXISTS services_name_gin_idx ON services USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS services_description_gin_idx ON services USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS services_location_gin_idx ON services USING gin (location gin_trgm_ops);
