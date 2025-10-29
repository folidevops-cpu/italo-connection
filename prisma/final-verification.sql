-- Final verification: Check all search-related indexes and extensions
SELECT 'Extensions Enabled:' as info;
SELECT extname, extversion FROM pg_extension WHERE extname IN ('pg_trgm', 'unaccent');

SELECT '' as separator;
SELECT 'Search Indexes Created:' as info;
SELECT 
    tablename, 
    indexname
FROM pg_indexes 
WHERE tablename IN ('listings', 'services') 
  AND (indexname LIKE '%gin%' OR indexname LIKE '%search%')
ORDER BY tablename, indexname;

SELECT '' as separator;
SELECT 'Total Listings:' as info;
SELECT COUNT(*) as count FROM listings;

SELECT '' as separator;
SELECT 'Total Services:' as info;
SELECT COUNT(*) as count FROM services;
