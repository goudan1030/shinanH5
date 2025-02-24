# 数据库设计文档

## 表结构

### members 表
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|--------|------|
| id | BIGINT(20) | 是 | AUTO_INCREMENT | 主键 |
| member_no | VARCHAR(10) | 是 | - | 会员编号 |
| type | VARCHAR(20) | 是 | 'NORMAL' | 会员类型 |
| status | VARCHAR(20) | 是 | 'ACTIVE' | 会员状态 |
| gender | VARCHAR(10) | 否 | - | 性别 |
| birth_year | INT | 否 | - | 出生年份 |
| height | INT | 否 | - | 身高 |
| education | VARCHAR(50) | 否 | - | 学历 |
| occupation | VARCHAR(100) | 否 | - | 职业 |
| province | VARCHAR(50) | 否 | - | 省份 |
| city | VARCHAR(50) | 否 | - | 城市 |
| district | VARCHAR(50) | 否 | - | 区县 |
| target_area | VARCHAR(100) | 否 | - | 目标地区 |
| children_plan | VARCHAR(20) | 否 | - | 子女计划 |
| marriage_cert | VARCHAR(20) | 否 | - | 结婚证要求 |
| self_description | TEXT | 否 | - | 形婚说明 |
| created_at | DATETIME | 是 | NOW() | 创建时间 |
| updated_at | DATETIME | 是 | NOW() | 更新时间 |

## 索引设计
- uk_phone: 手机号唯一索引
- uk_member_no: 会员编号唯一索引
- idx_gender: 性别索引
- idx_created_at: 创建时间索引

## 关联关系
(待补充) 