-- 检查字段是否已存在
SET @exist := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'user_settings'
  AND COLUMN_NAME = 'avatar'
);

-- 如果字段不存在，则添加
SET @query = IF(
  @exist = 0,
  'ALTER TABLE user_settings ADD COLUMN avatar VARCHAR(255) AFTER user_id',
  'SELECT "Avatar column already exists."'
);

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt; 