# GitHub OAuth2.0 完整配置指南

## 🎉 配置完成！

你的T3应用现在已经配置好了GitHub OAuth2.0认证。以下是完整的配置步骤和说明：

## 📋 已完成的配置

### 1. 代码配置 ✅
- ✅ 添加了GitHub Provider到 `src/server/auth/config.ts`
- ✅ 更新了环境变量配置 `src/env.js`
- ✅ 创建了专门的登录页面 `src/app/login/page.tsx`
- ✅ 更新了首页登录链接
- ✅ 数据库schema已支持GitHub认证

### 2. 需要你完成的步骤

#### 步骤1: 创建GitHub OAuth应用
1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息：
   - **Application name**: `T3 App` (或你喜欢的名称)
   - **Homepage URL**: `http://localhost:3000`
   - **Application description**: `T3 Stack应用` (可选)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

#### 步骤2: 获取客户端凭据
创建应用后，你会看到：
- **Client ID**: 复制这个ID
- **Client Secret**: 点击 "Generate a new client secret" 生成并复制

#### 步骤3: 配置环境变量
在项目根目录创建 `.env` 文件（如果还没有的话）：

```env
# 数据库配置
DATABASE_URL="你的数据库URL"

# NextAuth 配置
AUTH_SECRET="你的认证密钥"

# Discord OAuth (可选)
AUTH_DISCORD_ID="你的Discord客户端ID"
AUTH_DISCORD_SECRET="你的Discord客户端密钥"

# GitHub OAuth
AUTH_GITHUB_ID="你的GitHub客户端ID"
AUTH_GITHUB_SECRET="你的GitHub客户端密钥"

# 环境
NODE_ENV="development"
```

## 🚀 测试认证

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```

2. 访问应用：
   - 首页: `http://localhost:3000`
   - 登录页: `http://localhost:3000/login`

3. 点击 "使用 GitHub 登录" 按钮

4. 完成GitHub授权流程

## 🌐 生产环境配置

部署到生产环境时，需要：

1. 更新GitHub OAuth应用的回调URL：
   ```
   https://你的域名.com/api/auth/callback/github
   ```

2. 更新环境变量中的URL配置

3. 确保 `AUTH_SECRET` 在生产环境中已设置

## 📁 相关文件

- `src/server/auth/config.ts` - 认证配置
- `src/env.js` - 环境变量配置
- `src/app/login/page.tsx` - 登录页面
- `src/app/page.tsx` - 首页
- `prisma/schema.prisma` - 数据库schema

## 🔧 故障排除

### 常见问题：

1. **"Invalid OAuth App" 错误**
   - 检查Client ID和Client Secret是否正确
   - 确保回调URL配置正确

2. **"Callback URL mismatch" 错误**
   - 确保GitHub OAuth应用中的回调URL与你的应用URL匹配

3. **环境变量未加载**
   - 重启开发服务器
   - 检查 `.env` 文件是否在项目根目录

## 📚 参考文档

- [NextAuth.js GitHub Provider](https://next-auth.js.org/providers/github)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps)
- [T3 Stack 认证配置](https://create.t3.gg/en/usage/first-steps)

## 🎯 下一步

现在你可以：
1. 测试GitHub登录功能
2. 添加更多OAuth提供商（如Google、Twitter等）
3. 自定义用户界面
4. 添加用户权限管理

祝你编码愉快！ 🚀 