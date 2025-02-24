CREATE TABLE IF NOT EXISTS members (
  id BIGINT(20) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  member_no VARCHAR(10) NOT NULL,                    -- 会员编号
  type VARCHAR(20) NOT NULL,                         -- 会员类型
  status VARCHAR(20) NOT NULL,                       -- 会员状态
  province VARCHAR(50),                              -- 省份
  city VARCHAR(50),                                  -- 城市
  district VARCHAR(50),                              -- 区县
  gender VARCHAR(10),                                -- 性别
  target_area VARCHAR(100),                          -- 目标地区
  birth_year INT,                                    -- 出生年份
  height INT,                                        -- 身高
  weight INT,                                        -- 体重
  education VARCHAR(50),                             -- 学历
  occupation VARCHAR(100),                           -- 职业
  house_car VARCHAR(20),                            -- 房车情况
  hukou_province VARCHAR(50),                        -- 户籍省份
  hukou_city VARCHAR(50),                           -- 户籍城市
  children_plan VARCHAR(20),                         -- 子女计划
  marriage_cert VARCHAR(20),                         -- 结婚证要求
  self_description TEXT,                             -- 自我描述
  partner_requirement TEXT,                          -- 对象要求
  remaining_matches INT DEFAULT 0,                   -- 剩余匹配次数
  success_time DATETIME,                            -- 成功时间
  success_reason VARCHAR(255),                      -- 成功原因
  wechat VARCHAR(50),                               -- 微信号
  phone VARCHAR(20),                                -- 手机号
  marriage_history VARCHAR(20),                     -- 婚史
  sexual_orientation VARCHAR(20),                   -- 性取向
  nickname VARCHAR(50),                             -- 昵称
  deleted TINYINT(1) NOT NULL DEFAULT 0,            -- 是否删除
  created_at DATETIME NOT NULL,                     -- 创建时间
  updated_at DATETIME NOT NULL,                     -- 更新时间
  UNIQUE KEY `uk_phone` (`phone`),                  -- 手机号唯一索引
  UNIQUE KEY `uk_member_no` (`member_no`)           -- 会员编号唯一索引
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 