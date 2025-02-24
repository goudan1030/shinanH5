# H5 Cloud 项目需求文档

## 更新日志
- 2024-03-xx: 初始化需求文档
- 2024-03-xx: 添加用户头像上传问题修复需求
- 2024-03-xx: 添加会员列表排序需求
- 2024-03-xx: 修改会员详情页文案

## 1. 用户注册流程

### 1.1 基础信息注册
**状态**: 进行中  
**优先级**: 高  
**负责人**: -

#### 功能描述
1. 用户通过手机号注册/登录后，如果是新用户，需要完善基础信息
2. 系统自动将用户重定向到信息登记页面
3. 用户填写的信息将保存到 members 表中

#### 数据结构
members 表字段包括：
- 基础信息：
  - member_no (会员编号)
  - type (会员类型)
  - status (会员状态)
  - nickname (昵称)
  - phone (手机号)
  - wechat (微信号)

- 个人信息：
  - gender (性别)
  - birth_year (出生年份)
  - height (身高)
  - weight (体重)
  - education (学历)
  - occupation (职业)
  - marriage_history (婚史)
  - sexual_orientation (性取向)

- 地理信息：
  - province (省份)
  - city (城市)
  - district (区县)
  - target_area (目标地区)
  - hukou_province (户籍省)
  - hukou_city (户籍市)

- 择偶要求：
  - house_car (房车情况)
  - children_plan (子女计划)
  - marriage_cert (结婚证要求)
  - self_description (自我描述)
  - partner_requirement (对象要求)

#### 验证规则
1. 手机号必须符合中国大陆手机号格式
2. 身高范围：140-220cm
3. 体重范围：30-150kg
4. 文本长度限制：
   - 自我描述：最多500字
   - 对象要求：最多500字
5. 微信号格式：字母开头，6-20位字母数字下划线

#### 技术实现
1. 前端：
   - 路由：/register-info
   - 组件：RegisterInfoView.vue
   - 状态管理：使用 isNewUser 标记新用户

2. 后端：
   - 控制器：memberController
   - 服务：memberService, registerService
   - 数据验证：在 service 层进行
   - 错误处理：使用 MemberServiceError 统一处理错误

#### 待办事项
- [ ] 完善前端表单验证
- [ ] 添加省市区级联选择
- [ ] 实现图片上传功能
- [ ] 添加数据加密传输
- [ ] 完善错误提示信息

## 2. 用户资料管理

### 2.1 用户头像上传
**状态**: 待修复  
**优先级**: 高  
**负责人**: -

#### 问题描述
用户在个人资料页面上传头像后：
1. 头像实际已保存成功
2. 但前端提示"保存失败"
3. 错误信息：`authApi.updateUserInfo is not a function`

#### 技术分析
1. 错误原因：
   - API 方法名不匹配
   - authApi 中缺少 updateUserInfo 方法

2. 涉及文件：
   - 前端：
     - src/views/UserProfileView.vue
     - src/api/auth.ts
   - 后端：
     - h5-cloud-api/src/controllers/auth.ts
     - h5-cloud-api/src/services/authService.ts

#### 修复方案
1. 检查 authApi 中的方法名是否正确
2. 确保 API 方法名与后端接口匹配
3. 添加错误处理和成功提示
4. 更新相关文档

#### 验证标准
- [x] 头像上传成功后显示正确的成功提示
- [x] 上传失败时显示具体的错误信息
- [ ] 确保头像预览功能正常
- [x] 文档更新完整

## 3. 会员列表展示

### 3.1 公开会员列表
**状态**: 开发中  
**优先级**: 中  
**负责人**: -

#### 功能描述
1. 无需登录即可查看会员列表
2. 需要过滤敏感信息（手机号、微信号等）
3. 支持分页查询
4. 可选的筛选条件

#### 数据结构
从 members 表中展示以下字段：
- member_no (会员编号)
- gender (性别)
- birth_year (出生年份)
- height (身高)
- education (学历)
- occupation (职业)
- province (省份)
- city (城市)
- marriage_history (婚史)
- self_description (自我描述)

#### 隐私保护
以下字段不返回：
- phone (手机号)
- wechat (微信号)
- exact_location (具体位置)
- contact_info (联系方式)

#### 技术实现
1. 前端：
   - 路由：/members
   - 组件：MemberListView.vue
   - 分页：每页20条
   
2. 后端：
   - 控制器：memberController
   - 服务：memberService
   - 缓存：考虑添加Redis缓存

#### 验证标准
- [ ] 确保隐私字段不被返回
- [ ] 分页功能正常
- [ ] 列表加载性能正常
- [ ] 数据展示正确

## 4. 会员列表功能

### 4.1 列表展示
**状态**: 进行中  
**优先级**: 高  

#### 功能描述
1. 按照会员注册时间倒序排列
2. 每页显示20条数据
3. 支持性别、年龄、身高等筛选
4. 显示会员基本信息和形婚需求

#### 数据结构
members 表字段包括：
- 基础信息：
  - member_no (会员编号)
  - gender (性别)
  - birth_year (出生年份)
  - height (身高)
  - education (学历)
  - occupation (职业)

- 形婚需求：
  - children_plan (子女计划)
  - marriage_cert (结婚证要求)
  - self_description (形婚说明)

### 4.2 会员详情
**状态**: 进行中  
**优先级**: 高  

#### 功能描述
1. 显示会员完整资料
2. 显示形婚要求和说明
3. 支持收藏功能
4. 支持联系功能

## 2. 其他需求
(待添加...)

## 注意事项
1. 禁止私自调整样式和修改功能
2. 所有功能改动必须在本文档中记录
3. 代码提交前必须进行 Code Review
4. 保持与产品经理的及时沟通

## 遗留问题
1. 用户头像上传后提示保存失败，但实际已保存成功
   - 状态：待修复
   - 优先级：高
   - 相关文件：UserProfileView.vue
   - 错误信息：authApi.updateUserInfo is not a function 