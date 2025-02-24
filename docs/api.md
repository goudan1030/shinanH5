# API 文档

## 认证相关 API

### 1. 用户登录
- 路径: `/api/auth/login`
- 方法: POST
- 请求体:
  ```json
  {
    "phone": "string",    // 手机号
    "code": "string"      // 验证码
  }
  ```
- 响应:
  ```json
  {
    "success": true,
    "data": {
      "token": "string",
      "user": {
        "id": "number",
        "phone": "string",
        "isNewUser": "boolean"
      }
    }
  }
  ```

### 2. 会员信息注册
- 路径: `/api/register/info`
- 方法: POST
- 请求体: 
  ```json
  {
    "name": "string",
    "gender": "string[]",
    "birthday": "string",
    // ... 其他字段
  }
  ```
- 响应:
  ```json
  {
    "success": true,
    "message": "保存成功",
    "data": {
      "id": "number",
      "memberNo": "string"
    }
  }
  ```

### 3. 更新用户资料
- 路径: `/api/user/profile`
- 方法: PUT
- 请求体:
  ```json
  {
    "avatar": "string",    // 头像URL（可选）
    "nickname": "string"   // 昵称（可选）
  }
  ```
- 响应:
  ```json
  {
    "success": true,
    "message": "更新成功",
    "data": {
      "id": "number",
      "phone": "string",
      "avatar": "string",
      "nickname": "string",
      "isNewUser": "boolean"
    }
  }
  ```

### 4. 获取会员列表
- 路径: `/api/member/public`
- 方法: GET
- 参数:
  ```typescript
  {
    page?: number;      // 页码，默认 1
    pageSize?: number;  // 每页条数，默认 20
    gender?: string;    // 性别筛选
    ageStart?: number;  // 年龄起始
    ageEnd?: number;    // 年龄结束
    heightStart?: number; // 身高起始
    heightEnd?: number;   // 身高结束
    education?: string;   // 学历要求
    location?: string;    // 地区筛选
  }
  ```
- 响应:
  ```json
  {
    "success": true,
    "data": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "list": [{
        "member_no": "M10001",
        "gender": "女",
        "age": 28,
        "height": 165,
        "education": "本科",
        "occupation": "教师",
        "location": "上海",
        "marriage_history": "未婚",
        "self_description": "开朗活泼..."
      }]
    }
  }
  ```

## 错误码说明
- INVALID_PHONE_FORMAT: 手机号格式错误
- INVALID_DATA: 数据验证失败
- SAVE_FAILED: 保存失败 