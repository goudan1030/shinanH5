-- 添加 avatar 字段到 user_settings 表
ALTER TABLE user_settings 
ADD COLUMN avatar VARCHAR(255) AFTER user_id; 