# 数据库设计文档

## 表结构

### members 表
| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|--------|------|
| id | BIGINT(20) | 是 | AUTO_INCREMENT | 主键 |
| member_no | VARCHAR(10) | 是 | - | 会员编号 |
| type | VARCHAR(20) | 是 | 'NORMAL' | 会员类型 |
| status | VARCHAR(20) | 是 | 'ACTIVE' | 会员状态 |
| ... | ... | ... | ... | ... |

## 索引设计
- uk_phone: 手机号唯一索引
- uk_member_no: 会员编号唯一索引

## 关联关系
(待补充) 