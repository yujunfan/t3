# NextAuth.js 完整指南

## 📚 目录
- [基础概念](#基础概念)
- [核心组件](#核心组件)
- [路由机制解析](#路由机制解析)
- [认证流程](#认证流程)
- [配置详解](#配置详解)
- [实际应用](#实际应用)
- [常见问题](#常见问题)

---

## 🎯 基础概念

### 什么是 NextAuth.js？
NextAuth.js 是一个用于 Next.js 的完整身份验证解决方案，支持：
- **多种登录方式**：OAuth、邮箱密码、JWT、数据库等
- **多种数据库**：MySQL、PostgreSQL、MongoDB、SQLite 等
- **多种提供商**：Google、GitHub、Discord、自定义等
- **类型安全**：完整的 TypeScript 支持

### 核心特性
- ✅ **零配置**：开箱即用
- ✅ **类型安全**：完整的 TypeScript 支持
- ✅ **多种适配器**：支持各种数据库
- ✅ **JWT 和数据库会话**：灵活的会话管理
- ✅ **CSRF 保护**：内置安全机制
- ✅ **响应式设计**：支持移动端

---

## 🏗️ 核心组件

### 1. 认证配置 (`authConfig`)
```typescript
// src/server/auth/config.ts
export const authConfig = {
  providers: [
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
```

### 2. 认证实例 (`auth`)
```typescript
// src/server/auth/index.ts
const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);
const auth = cache(uncachedAuth); // 缓存认证实例
```

### 3. API 路由处理器
```typescript
// src/app/api/auth/[...nextauth]/route.ts
export const { GET, POST } = handlers;
```

---

## 🛣️ 路由机制解析

### 动态路由捕获
```typescript
// src/app/api/auth/[...nextauth]/route.ts
export const { GET, POST } = handlers;
```

`[...nextauth]` 是一个**动态路由**，它会捕获所有以 `/api/auth/` 开头的请求。

### NextAuth.js 自动生成的路由

| 路由 | 方法 | 功能 | 说明 |
|------|------|------|------|
| `/api/auth/signin` | GET | 登录页面 | 显示可用的登录提供商 |
| `/api/auth/signin` | POST | 登录处理 | 处理登录请求 |
| `/api/auth/signout` | GET | 登出页面 | 显示登出确认页面 |
| `/api/auth/signout` | POST | 登出处理 | 清除会话并重定向 |
| `/api/auth/callback/{provider}` | GET | OAuth 回调 | 处理 OAuth 授权回调 |
| `/api/auth/session` | GET | 会话信息 | 获取当前用户会话 |
| `/api/auth/csrf` | GET | CSRF 保护 | 生成 CSRF 令牌 |
| `/api/auth/providers` | GET | 提供商列表 | 获取可用的登录提供商 |

### 为什么找不到具体代码？

**NextAuth.js 内置了这些页面**，你不需要手动创建。当你访问这些路由时：

1. **GET 请求**：显示相应的页面（登录、登出确认等）
2. **POST 请求**：执行相应的操作（登录、登出等）

### handlers 对象详解

```typescript
// src/server/auth/index.ts
const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(authConfig);
```

`handlers` 对象包含了所有 NextAuth.js 的 API 路由处理器：
- `GET` 处理器：处理页面显示请求
- `POST` 处理器：处理表单提交和操作请求

---

## 🔄 认证流程

### 1. OAuth 认证流程
```
用户点击登录 → /api/auth/signin → 选择提供商 → 重定向到 OAuth 提供商 → 
用户授权 → 回调到 /api/auth/callback/{provider} → 创建会话 → 重定向到首页
```

### 2. 会话管理流程
```
用户访问页面 → 检查会话 → 如果有效则显示用户信息 → 
如果无效则重定向到登录页面
```

### 3. 登出流程
```
用户点击登出 → /api/auth/signout → 清除会话 → 重定向到首页
```

---

## ⚙️ 配置详解

### 1. 环境变量配置
```env
# 数据库配置
DATABASE_URL="mysql://username:password@localhost:3306/t3_app"

# NextAuth 配置
AUTH_SECRET="your-auth-secret-here"

# Discord OAuth 配置
AUTH_DISCORD_ID="your-discord-client-id"
AUTH_DISCORD_SECRET="your-discord-client-secret"

# GitHub OAuth 配置
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

### 2. 数据库适配器
```typescript
// 使用 Prisma 适配器
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/server/db";

export const authConfig = {
  adapter: PrismaAdapter(db),
  // ... 其他配置
};
```

### 3. 回调函数
```typescript
export const authConfig = {
  callbacks: {
    // 会话回调
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    
    // JWT 回调（如果使用 JWT）
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    // 重定向回调
    redirect: ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
};
```

---

## 💻 实际应用

### 1. 服务器端获取会话
```typescript
// src/app/page.tsx
import { auth } from "@/server/auth";

export default async function Home() {
  const session = await auth();
  
  if (session?.user) {
    return <div>欢迎, {session.user.name}!</div>;
  }
  
  return <div>请登录</div>;
}
```

### 2. 客户端使用会话
```typescript
"use client";
import { useSession } from "next-auth/react";

export default function ClientComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>加载中...</div>;
  if (status === "unauthenticated") return <div>请登录</div>;
  
  return <div>欢迎, {session?.user?.name}!</div>;
}
```

### 3. 登录按钮
```typescript
import Link from "next/link";

export default function LoginButton({ session }) {
  return (
    <Link
      href={session ? "/api/auth/signout" : "/api/auth/signin"}
      className="login-button"
    >
      {session ? "登出" : "登录"}
    </Link>
  );
}
```

### 4. 自定义登录页面
```typescript
// src/app/login/page.tsx
export default async function LoginPage() {
  const session = await auth();
  
  if (session) {
    redirect("/");
  }
  
  return (
    <div>
      <a href="/api/auth/signin?provider=discord">Discord 登录</a>
      <a href="/api/auth/signin?provider=github">GitHub 登录</a>
    </div>
  );
}
```

### 5. 自定义登出页面
```typescript
"use client";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: "/",
      redirect: true 
    });
  };
  
  return (
    <div>
      <h1>确认登出</h1>
      <button onClick={handleSignOut}>确认登出</button>
    </div>
  );
}
```

---

## 🔧 常见问题

### 1. 环境变量未加载
**问题**：认证配置报错，提示环境变量未定义
**解决**：
- 确保 `.env` 文件在项目根目录
- 重启开发服务器
- 检查环境变量名称是否正确

### 2. OAuth 回调错误
**问题**：OAuth 登录后出现回调错误
**解决**：
- 检查 OAuth 应用的回调 URL 配置
- 确保回调 URL 与你的应用 URL 匹配
- 验证客户端 ID 和密钥是否正确

### 3. 数据库连接问题
**问题**：认证时数据库连接失败
**解决**：
- 检查数据库 URL 配置
- 确保数据库服务正在运行
- 验证数据库权限设置

### 4. 会话不持久
**问题**：刷新页面后用户需要重新登录
**解决**：
- 检查 `AUTH_SECRET` 是否设置
- 确保数据库适配器配置正确
- 验证会话存储设置

### 5. 类型错误
**问题**：TypeScript 类型检查失败
**解决**：
- 确保安装了正确的类型定义
- 检查模块声明是否正确
- 验证导入路径是否正确

---

## 📖 最佳实践

### 1. 安全性
- ✅ 使用强密码的 `AUTH_SECRET`
- ✅ 在生产环境中设置所有必需的环境变量
- ✅ 定期更新依赖包
- ✅ 使用 HTTPS 在生产环境中

### 2. 性能
- ✅ 使用 `cache()` 包装认证函数
- ✅ 合理使用会话缓存
- ✅ 避免在客户端组件中频繁调用认证 API

### 3. 用户体验
- ✅ 提供清晰的登录/登出流程
- ✅ 添加加载状态指示器
- ✅ 处理错误情况并提供友好的错误信息

### 4. 代码组织
- ✅ 将认证配置集中管理
- ✅ 使用类型安全的配置
- ✅ 分离认证逻辑和业务逻辑

---

## 🔗 相关资源

- [NextAuth.js 官方文档](https://next-auth.js.org/)
- [NextAuth.js GitHub](https://github.com/nextauthjs/next-auth)
- [T3 Stack 认证指南](https://create.t3.gg/en/usage/first-steps)
- [OAuth 2.0 规范](https://tools.ietf.org/html/rfc6749)

---

## 📝 总结

NextAuth.js 是一个强大而灵活的认证解决方案，通过理解其核心概念、路由机制和配置选项，你可以轻松地为你的 Next.js 应用添加完整的身份验证功能。

关键要点：
1. **动态路由** `[...nextauth]` 捕获所有认证相关的请求
2. **handlers 对象** 提供所有认证 API 的处理器
3. **内置页面** 无需手动创建登录/登出页面
4. **类型安全** 完整的 TypeScript 支持
5. **灵活配置** 支持多种数据库和认证提供商

通过合理配置和使用 NextAuth.js，你可以快速构建安全、可靠的用户认证系统。🚀 