# 部署文档

## 环境要求
- Node.js >= 16
- MySQL >= 8.0
- Redis (可选)

## 配置说明
### 1. 数据库配置
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=h5_cloud
```

### 2. 短信服务配置
```env
ALI_SMS_ACCESS_KEY_ID=your_key_id
ALI_SMS_ACCESS_KEY_SECRET=your_key_secret
ALI_SMS_SIGN_NAME=your_sign_name
ALI_SMS_TEMPLATE_LOGIN=your_template_code
```

### 3. JWT配置
```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

## 部署步骤
1. 安装依赖
```bash
npm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填写配置信息
```

3. 数据库迁移
```bash
npm run migrate
```

4. 启动服务
```bash
npm run build
npm run start
```

## 监控告警
1. 接口响应时间监控
2. 数据库连接池监控
3. 短信发送成功率监控
4. 错误日志监控 