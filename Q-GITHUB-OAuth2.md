# GitHub OAuth2.0 配置指南

## 1. 创建GitHub OAuth应用

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App" 按钮
3. 填写应用信息：
   - **Application name**: 你的应用名称（例如：My T3 App）
   - **Homepage URL**: `http://localhost:3000` (开发环境)
   - **Application description**: 应用描述（可选）
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

## 2. 获取客户端凭据

创建应用后，你会获得：
- **Client ID**: 客户端ID  Ov23lizN1LXWBREBXGAE
- **Client Secret**: 客户端密钥（点击 "Generate a new client secret" 生成）

## 3. 配置环境变量

在项目根目录创建或更新 `.env` 文件：

```env
# GitHub OAuth
AUTH_GITHUB_ID=你的GitHub客户端ID
AUTH_GITHUB_SECRET=你的GitHub客户端密钥

# 其他现有环境变量...
AUTH_DISCORD_ID=你的Discord客户端ID
AUTH_DISCORD_SECRET=你的Discord客户端密钥
AUTH_SECRET=你的认证密钥
DATABASE_URL=你的数据库URL
```

## 4. 生产环境配置

部署到生产环境时，需要更新GitHub OAuth应用的回调URL：

1. 在GitHub OAuth应用设置中，将 **Authorization callback URL** 改为：
   ```
   https://你的域名.com/api/auth/callback/github
   ```

2. 更新环境变量中的URL配置

## 5. 测试认证

1. 启动开发服务器：`npm run dev`
2. 访问登录页面
3. 点击 "Sign in with GitHub" 按钮
4. 完成GitHub授权流程

## 参考文档

- [NextAuth.js GitHub Provider](https://next-auth.js.org/providers/github)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps)
- [T3 Stack 认证配置](https://create.t3.gg/en/usage/first-steps) 