# Discord OAuth2.0 配置指南

## 问题诊断
你遇到的错误是 `ConnectTimeoutError`，这通常是由于以下原因造成的：

1. **缺少环境变量文件**
2. **Discord 应用配置不正确**
3. **网络连接问题**

## 当前状态分析
从调试日志可以看出：
- ✅ OAuth2.0 授权阶段正常
- ✅ Discord 应用配置正确
- ❌ 回调阶段网络连接超时

## 解决步骤

### 1. 创建环境变量文件
在项目根目录创建 `.env` 文件：

```bash
# 数据库配置
DATABASE_URL="file:./db.sqlite"

# NextAuth 配置
# 生成一个随机的密钥: openssl rand -base64 32
AUTH_SECRET="your-secret-key-here-change-this-in-production"

# Discord OAuth2.0 配置
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"

# 环境配置
NODE_ENV="development"
```

### 2. 配置 Discord 应用

#### 步骤 1: 创建 Discord 应用
1. 访问 [Discord 开发者门户](https://discord.com/developers/applications)
2. 点击 "New Application"
3. 输入应用名称和描述

#### 步骤 2: 配置 OAuth2.0
1. 在左侧菜单选择 "OAuth2"
2. 复制 "Client ID" 和 "Client Secret"
3. 在 "Redirects" 部分添加重定向 URL：
   - 开发环境: `http://localhost:3000/api/auth/callback/discord`
   - 生产环境: `https://yourdomain.com/api/auth/callback/discord`

#### 步骤 3: 设置应用权限
1. 在 "Bot" 部分，确保启用了必要的权限
2. 在 "OAuth2" 部分，选择需要的 scopes：
   - `identify` (必需)
   - `email` (可选)

### 3. 网络连接诊断

#### 测试 Discord API 连接
访问 `http://localhost:3000/api/test-connection` 来测试网络连接。

#### 常见网络问题解决方案：

1. **防火墙设置**
   - 确保允许 Node.js 和 Next.js 访问网络
   - 检查 Windows Defender 防火墙设置

2. **代理设置**
   - 如果你使用代理，确保正确配置
   - 尝试在系统环境变量中设置代理

3. **DNS 问题**
   - 尝试使用公共 DNS (如 8.8.8.8)
   - 清除 DNS 缓存

4. **网络超时**
   - 我已经在配置中增加了超时时间
   - 如果问题持续，可能需要检查网络质量

### 4. 更新环境变量
将你的 Discord 应用信息填入 `.env` 文件：

```bash
AUTH_DISCORD_ID="你的Discord客户端ID"
AUTH_DISCORD_SECRET="你的Discord客户端密钥"
```

### 5. 重启开发服务器
```bash
pnpm dev
```

## 调试信息

### 启用调试模式
调试模式已经启用，你会看到详细的 `[auth][debug]` 日志，包括：
- PKCE 代码验证器创建
- 授权 URL 生成
- 回调处理过程
- 错误详情

### 日志解读
- `CREATE_PKCECODEVERIFIER` - OAuth2.0 安全流程正常
- `authorization url is ready` - 授权 URL 生成成功
- `callback route error details` - 回调阶段出现问题
- `ConnectTimeoutError` - 网络连接超时

## 常见问题

### 连接超时
- 检查网络连接
- 确保 Discord 开发者门户可访问
- 验证客户端 ID 和密钥是否正确
- 尝试使用网络诊断工具

### 重定向错误
- 确保重定向 URL 完全匹配
- 检查是否包含正确的协议 (http/https)
- 验证端口号是否正确

### 权限错误
- 确保在 Discord 应用中启用了必要的权限
- 检查 OAuth2 scopes 配置

## 测试
配置完成后，访问 `http://localhost:3000/api/auth/signin` 测试登录功能。 