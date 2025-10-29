-- Verify indexes were created
SELECT 
    tablename, 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename IN ('listings', 'services') 
  AND indexname LIKE '%gin%'
ORDER BY tablename, indexname;
