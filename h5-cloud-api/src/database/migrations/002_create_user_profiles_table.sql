-- 删除表（如果存在）
DROP TABLE IF EXISTS user_profiles;

-- 创建表
CREATE TABLE user_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  gender VARCHAR(10),
  birthday VARCHAR(10),
  height VARCHAR(10),
  weight VARCHAR(10),
  orientation VARCHAR(20),
  occupation VARCHAR(50),
  education VARCHAR(50),
  marital_status VARCHAR(20),
  residence VARCHAR(100),
  hometown VARCHAR(100),
  assets VARCHAR(20),
  expected_location VARCHAR(100),
  child_intent VARCHAR(20),
  marriage_requirement VARCHAR(20),
  self_intro TEXT,
  expectations TEXT,
  wechat VARCHAR(50),
  contact_phone VARCHAR(20),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 添加索引
CREATE INDEX idx_user_profiles_gender ON user_profiles(gender);
CREATE INDEX idx_user_profiles_orientation ON user_profiles(orientation);
CREATE INDEX idx_user_profiles_residence ON user_profiles(residence); 