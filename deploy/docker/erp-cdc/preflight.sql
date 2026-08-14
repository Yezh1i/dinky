-- Run against the source MySQL before rendering the table whitelist.
-- This file is read-only and supports MySQL 5.7.

SET @source_db = 'haidb_new';

-- Inventory.
SELECT COUNT(*) AS base_table_count
FROM information_schema.tables
WHERE table_schema = @source_db
  AND table_type = 'BASE TABLE';

-- Must be excluded: table names containing whitespace.
SELECT table_name AS table_name_with_whitespace
FROM information_schema.tables
WHERE table_schema = @source_db
  AND table_type = 'BASE TABLE'
  AND table_name REGEXP '[[:space:]]'
ORDER BY table_name;

-- Must be excluded: tables without primary keys.
SELECT t.table_name AS table_without_primary_key
FROM information_schema.tables t
WHERE t.table_schema = @source_db
  AND t.table_type = 'BASE TABLE'
  AND NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints c
    WHERE c.table_schema = t.table_schema
      AND c.table_name = t.table_name
      AND c.constraint_type = 'PRIMARY KEY'
  )
ORDER BY t.table_name;

-- Review all source types against the documented mapping matrix.
SELECT data_type, COUNT(*) AS column_count
FROM information_schema.columns
WHERE table_schema = @source_db
GROUP BY data_type
ORDER BY column_count DESC, data_type;

-- Unsigned boundaries require explicit DDL verification in StarRocks.
SELECT table_name, column_name, column_type, column_key
FROM information_schema.columns
WHERE table_schema = @source_db
  AND column_type LIKE '%unsigned%'
ORDER BY table_name, ordinal_position;

-- Decimal primary keys need review; only DECIMAL(20,0) produced by
-- BIGINT UNSIGNED has the custom LARGEINT primary-key mapping.
SELECT c.table_name, c.column_name, c.column_type
FROM information_schema.columns c
WHERE c.table_schema = @source_db
  AND c.column_key = 'PRI'
  AND c.data_type IN ('decimal', 'numeric')
ORDER BY c.table_name, c.ordinal_position;

-- Chinese/non-ASCII identifiers are supported by the patched image, but
-- must remain in the canary test set after every image upgrade.
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = @source_db
  AND column_name REGEXP '[^ -~]'
ORDER BY table_name, ordinal_position;

-- Comment regression set. The query intentionally includes the known
-- "audited" case and comments with common SQL-escaping characters.
SELECT table_name, column_name, column_comment
FROM information_schema.columns
WHERE table_schema = @source_db
  AND (
    column_comment LIKE '%audited%'
    OR column_comment LIKE '%"%'
    OR column_comment LIKE '%\\%'
    OR column_comment LIKE CONCAT('%', CHAR(10), '%')
    OR column_comment LIKE CONCAT('%', CHAR(13), '%')
    OR column_comment LIKE CONCAT('%', CHAR(9), '%')
  )
ORDER BY table_name, ordinal_position;

-- Table comments must also be carried to StarRocks.
SELECT table_name, table_comment
FROM information_schema.tables
WHERE table_schema = @source_db
  AND table_type = 'BASE TABLE'
  AND table_comment <> ''
ORDER BY table_name;
