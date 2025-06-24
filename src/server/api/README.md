# API 目录说明文档

这个目录包含了 T3 应用的所有 API 相关文件，使用 tRPC 提供类型安全的 API 调用。

## 目录结构

```
src/server/api/
├── README.md              # 本文档
├── root.ts                # 主路由器，聚合所有子路由器
├── trpc.ts                # tRPC 核心配置文件
├── routers/               # 各个功能模块的路由器
│   └── post.ts           # 帖子相关的 API 端点
└── [trpc]/               # tRPC HTTP 处理器
    └── route.ts          # tRPC API 路由处理
```

## 文件功能详解

### 1. `trpc.ts` - tRPC 核心配置
**主要功能：**
- 创建 tRPC 上下文（包含数据库连接、用户会话等）
- 初始化 tRPC 实例和错误处理
- 定义中间件（如计时中间件）
- 导出公共程序和受保护程序的基础函数

**关键导出：**
- `createTRPCContext`: 创建请求上下文
- `publicProcedure`: 公共 API 端点（无需登录）
- `protectedProcedure`: 受保护 API 端点（需要登录）
- `createCallerFactory`: 服务器端调用器工厂

### 2. `root.ts` - 主路由器
**主要功能：**
- 聚合所有功能模块的路由器
- 导出完整的 API 类型定义
- 创建服务器端调用器

**关键导出：**
- `appRouter`: 主路由器，包含所有子路由器
- `AppRouter`: API 类型定义
- `createCaller`: 服务器端调用器

### 3. `routers/post.ts` - 帖子路由器
**主要功能：**
- 定义所有与帖子相关的 API 端点
- 包含数据验证和权限控制

**API 端点：**
- `hello`: 公共端点，测试问候功能
- `create`: 受保护端点，创建新帖子
- `getLatest`: 受保护端点，获取用户最新帖子
- `getSecretMessage`: 受保护端点，获取秘密消息

### 4. `[trpc]/route.ts` - tRPC HTTP 处理器
**主要功能：**
- 处理来自前端的 HTTP 请求
- 将 HTTP 请求转换为 tRPC 调用
- 返回 JSON 响应

## 使用方式

### 前端调用示例
```typescript
// 使用 tRPC 客户端调用 API
const { data } = await api.post.hello.query({ text: "World" });
const newPost = await api.post.create.mutate({ name: "My Post" });
```

### 服务器端调用示例
```typescript
// 在服务器端直接调用 API
const caller = createCaller(createContext);
const posts = await caller.post.getLatest();
```

## 扩展指南

### 添加新的功能模块
1. 在 `routers/` 目录下创建新的路由器文件
2. 在 `root.ts` 中导入并添加到主路由器
3. 定义相应的 API 端点和数据验证

### 示例：添加用户管理
```typescript
// routers/user.ts
export const userRouter = createTRPCRouter({
  profile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id }
    });
  })
});

// root.ts
import { userRouter } from "./routers/user";
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter, // 新增
});
```

## 安全特性

- **类型安全**: 使用 TypeScript 和 tRPC 确保前后端类型一致
- **输入验证**: 使用 Zod 进行数据验证
- **权限控制**: 区分公共和受保护的端点
- **错误处理**: 统一的错误格式和验证错误处理

## 性能特性

- **开发环境延迟**: 模拟真实网络环境
- **执行时间监控**: 记录 API 调用执行时间
- **服务器端调用**: 支持 SSR/SSG 场景的直接调用 