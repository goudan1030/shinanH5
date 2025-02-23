USE h5_cloud_db;

ALTER TABLE users
ADD COLUMN status ENUM('not-logged-in', 'need-setup', 'active') 
DEFAULT 'not-logged-in' 
AFTER phone;

-- 更新现有用户状态
UPDATE users 
SET status = CASE
    WHEN username IS NULL THEN 'need-setup'
    ELSE 'active'
END;