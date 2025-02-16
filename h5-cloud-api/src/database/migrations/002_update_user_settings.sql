-- 检查 user_settings 表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS user_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  username VARCHAR(50),
  password VARCHAR(100),
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 检查并添加列（如果不存在）
SET @exist_username := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'user_settings'
  AND COLUMN_NAME = 'username'
);

SET @exist_password := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'user_settings'
  AND COLUMN_NAME = 'password'
);

SET @sql_add_username = IF(
  @exist_username = 0,
  'ALTER TABLE user_settings ADD COLUMN username VARCHAR(50) AFTER user_id',
  'SELECT "username column already exists."'
);

SET @sql_add_password = IF(
  @exist_password = 0,
  'ALTER TABLE user_settings ADD COLUMN password VARCHAR(100) AFTER username',
  'SELECT "password column already exists."'
);

PREPARE stmt_username FROM @sql_add_username;
PREPARE stmt_password FROM @sql_add_password;

EXECUTE stmt_username;
EXECUTE stmt_password;

DEALLOCATE PREPARE stmt_username;
DEALLOCATE PREPARE stmt_password;

-- 检查并添加唯一索引（如果不存在）
SET @exist_index := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'user_settings'
  AND INDEX_NAME = 'idx_user_id'
);

SET @sql_add_index = IF(
  @exist_index = 0,
  'ALTER TABLE user_settings ADD UNIQUE INDEX idx_user_id (user_id)',
  'SELECT "Index already exists."'
);

PREPARE stmt_index FROM @sql_add_index;
EXECUTE stmt_index;
DEALLOCATE PREPARE stmt_index;

-- 检查并从 users 表移除列（如果存在）
SET @exist_user_username := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'users'
  AND COLUMN_NAME = 'username'
);

SET @exist_user_password := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'users'
  AND COLUMN_NAME = 'password'
);

-- 使用 CASE 表达式构建 SQL
SET @sql_drop_columns = CASE 
  WHEN @exist_user_username = 1 AND @exist_user_password = 1 
    THEN 'ALTER TABLE users DROP COLUMN username, DROP COLUMN password'
  WHEN @exist_user_username = 1 
    THEN 'ALTER TABLE users DROP COLUMN username'
  WHEN @exist_user_password = 1 
    THEN 'ALTER TABLE users DROP COLUMN password'
  ELSE 'SELECT "No columns to drop."'
END;

PREPARE stmt_drop FROM @sql_drop_columns;
EXECUTE stmt_drop;
DEALLOCATE PREPARE stmt_drop;

-- 添加用户状态字段
ALTER TABLE users 
ADD COLUMN status ENUM('temporary', 'active', 'disabled') 
DEFAULT 'temporary' 
AFTER phone;

-- 更新现有用户状态为激活
UPDATE users SET status = 'active'; 