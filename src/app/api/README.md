# Next.js App Router API 路由完整指南

这个目录包含了 Next.js App Router 中的所有 API 路由，使用现代的文件系统路由和服务器组件架构。

## 目录结构

```
src/app/api/
├── README.md              # 本文档
├── trpc/                  # tRPC API 路由
│   └── [trpc]/           # 动态路由段
│       └── route.ts      # tRPC HTTP 处理器
└── auth/                  # NextAuth.js 认证路由
    └── [...nextauth]/    # 捕获所有认证相关路由
        └── route.ts      # NextAuth.js 处理器
```

## 1. Next.js App Router API 路由基础

### 1.1 什么是 App Router API 路由？
- **文件系统路由**：基于文件路径自动生成 API 端点
- **服务器端执行**：所有代码在服务器端运行，不会发送到客户端
- **类型安全**：支持 TypeScript 和类型检查
- **自动优化**：内置性能优化和缓存机制

### 1.2 路由约定
```typescript
// 基本路由
app/api/users/route.ts          // GET /api/users, POST /api/users
app/api/users/[id]/route.ts     // GET /api/users/123, PUT /api/users/123

// 动态路由
app/api/posts/[slug]/route.ts   // GET /api/posts/hello-world

// 捕获所有路由
app/api/auth/[...nextauth]/route.ts  // 捕获 /api/auth/* 的所有请求
```

### 1.3 HTTP 方法支持
```typescript
// route.ts
export async function GET(request: Request) {
  // 处理 GET 请求
}

export async function POST(request: Request) {
  // 处理 POST 请求
}

export async function PUT(request: Request) {
  // 处理 PUT 请求
}

export async function DELETE(request: Request) {
  // 处理 DELETE 请求
}

export async function PATCH(request: Request) {
  // 处理 PATCH 请求
}
```

## 2. tRPC API 路由详解

### 2.1 文件位置：`/api/trpc/[trpc]/route.ts`

这个文件是 tRPC 的 HTTP 适配器，将 HTTP 请求转换为 tRPC 调用。

### 2.2 核心功能
```typescript
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

/**
 * 创建 tRPC 上下文
 * 为每个 HTTP 请求提供必要的上下文信息（数据库连接、用户会话等）
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

/**
 * tRPC HTTP 处理器
 * 使用 fetchRequestHandler 适配器处理 HTTP 请求
 */
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",        // API 端点路径
    req,                          // Next.js 请求对象
    router: appRouter,            // tRPC 路由器
    createContext: () => createContext(req),  // 上下文创建函数
    onError:                      // 错误处理
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

// 导出 GET 和 POST 处理器
export { handler as GET, handler as POST };
```

### 2.3 工作原理
1. **请求接收**：Next.js 接收 HTTP 请求到 `/api/trpc/*`
2. **上下文创建**：为请求创建 tRPC 上下文（包含数据库、会话等）
3. **路由匹配**：根据请求路径匹配相应的 tRPC 程序
4. **执行程序**：执行匹配的 tRPC 程序并返回结果
5. **响应返回**：将结果转换为 HTTP 响应返回给客户端

### 2.4 使用示例
```typescript
// 前端调用
const { data } = await api.post.hello.query({ text: "World" });

// 实际发送的 HTTP 请求
// POST /api/trpc/post.hello
// Body: { "text": "World" }
```

## 3. NextAuth.js 认证路由详解

### 3.1 文件位置：`/api/auth/[...nextauth]/route.ts`

这个文件处理所有 NextAuth.js 相关的认证请求。

### 3.2 核心功能
```typescript
import { handlers } from "@/server/auth";

// 导出 NextAuth.js 的 GET 和 POST 处理器
export const { GET, POST } = handlers;
```

### 3.3 处理的认证端点
- `/api/auth/signin` - 登录页面
- `/api/auth/signout` - 登出
- `/api/auth/callback` - OAuth 回调
- `/api/auth/session` - 获取会话信息
- `/api/auth/csrf` - CSRF 令牌
- `/api/auth/providers` - 获取认证提供商列表

### 3.4 认证流程
1. **登录请求**：用户访问 `/api/auth/signin`
2. **提供商选择**：用户选择认证提供商（Google、GitHub 等）
3. **OAuth 重定向**：重定向到第三方认证服务
4. **回调处理**：处理认证回调并创建会话
5. **会话管理**：管理用户会话和令牌

## 4. API 路由最佳实践

### 4.1 错误处理
```typescript
export async function GET(request: Request) {
  try {
    // 处理请求
    const data = await processRequest();
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 4.2 请求验证
```typescript
import { z } from 'zod';

const requestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);
    
    // 处理验证后的数据
    return Response.json({ success: true, data: validatedData });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    );
  }
}
```

### 4.3 中间件和认证
```typescript
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // 处理已认证的请求
  return Response.json({ data: 'Protected data' });
}
```

### 4.4 数据库操作
```typescript
import { db } from "@/server/db";

export async function GET(request: Request) {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    
    return Response.json({ users });
  } catch (error) {
    return Response.json(
      { error: 'Database error' },
      { status: 500 }
    );
  }
}
```

## 5. 环境配置

### 5.1 环境变量
```bash
# .env.local
DATABASE_URL="mysql://username:password@localhost:3306/database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 5.2 类型安全的环境变量
```typescript
// src/env.js
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
  },
  client: {
    // 客户端环境变量
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
});
```

## 6. 性能优化

### 6.1 缓存策略
```typescript
export async function GET(request: Request) {
  // 设置缓存头
  const response = Response.json({ data: 'cached data' });
  response.headers.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  return response;
}
```

### 6.2 流式响应
```typescript
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('Hello '));
      setTimeout(() => {
        controller.enqueue(encoder.encode('World!'));
        controller.close();
      }, 1000);
    },
  });

  return new Response(stream);
}
```

### 6.3 分页处理
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const users = await db.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  
  return Response.json({ users, page, limit });
}
```

## 7. 测试 API 路由

### 7.1 使用 curl 测试
```bash
# 测试 tRPC 端点
curl -X POST http://localhost:3000/api/trpc/post.hello \
  -H "Content-Type: application/json" \
  -d '{"text": "World"}'

# 测试认证端点
curl http://localhost:3000/api/auth/session
```

### 7.2 使用 Postman 测试
1. 创建新的请求
2. 设置请求方法和 URL
3. 添加必要的请求头
4. 发送请求并查看响应

### 7.3 单元测试
```typescript
import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('API Route', () => {
  it('should return data', async () => {
    const request = new Request('http://localhost:3000/api/test');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

## 8. 部署考虑

### 8.1 Vercel 部署
- API 路由自动部署为 Serverless 函数
- 支持边缘函数和中间件
- 自动环境变量配置

### 8.2 其他平台
- 确保支持 Node.js 运行时
- 配置环境变量
- 设置正确的构建命令

## 9. 常见问题

### 9.1 CORS 问题
```typescript
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

### 9.2 文件上传
```typescript
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (file) {
    // 处理文件上传
    const bytes = await file.arrayBuffer();
    // 保存文件...
  }
  
  return Response.json({ success: true });
}
```

### 9.3 大文件处理
```typescript
export async function POST(request: Request) {
  const reader = request.body?.getReader();
  const chunks = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  const buffer = Buffer.concat(chunks);
  // 处理大文件...
}
```

## 10. 资源链接

- [Next.js App Router 文档](https://nextjs.org/docs/app)
- [Next.js API 路由文档](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [tRPC 文档](https://trpc.io/docs)
- [NextAuth.js 文档](https://next-auth.js.org/)
- [Vercel 部署指南](https://vercel.com/docs/concepts/functions/serverless-functions)

---

## 11. 架构深度解析：app/api 与 server/api 的调用关系

### 11.1 目录结构对比

```
src/
├── app/api/                    # Next.js App Router API 路由
│   ├── trpc/[trpc]/route.ts   # HTTP 入口点
│   └── auth/[...nextauth]/route.ts
└── server/api/                 # tRPC 业务逻辑层
    ├── trpc.ts                # tRPC 配置和上下文
    ├── root.ts                # 主路由器
    └── routers/               # 业务路由器
        └── post.ts            # 帖子相关 API
```

### 11.2 调用关系详解

#### 11.2.1 请求流程
```
客户端请求 → app/api/trpc/[trpc]/route.ts → server/api/root.ts → server/api/routers/* → Prisma → 数据库
```

#### 11.2.2 详细步骤
1. **HTTP 请求入口**：`app/api/trpc/[trpc]/route.ts`
   - 接收来自客户端的 HTTP 请求
   - 使用 `fetchRequestHandler` 适配器处理请求

2. **上下文创建**：`server/api/trpc.ts`
   - 创建 tRPC 上下文（数据库连接、用户会话等）
   - 提供中间件和程序类型

3. **路由分发**：`server/api/root.ts`
   - 聚合所有子路由器
   - 根据请求路径分发到相应的路由器

4. **业务逻辑**：`server/api/routers/*`
   - 执行具体的业务逻辑
   - 调用 Prisma 进行数据库操作

5. **数据访问**：Prisma
   - 执行数据库查询和操作
   - 返回类型安全的数据

### 11.3 技术栈协作机制

#### 11.3.1 各组件职责

| 组件 | 职责 | 位置 |
|------|------|------|
| **Page** | 用户界面和交互 | `src/app/page.tsx` |
| **tRPC Client** | 前端 API 调用 | `src/trpc/react.tsx` |
| **App Router** | HTTP 路由处理 | `src/app/api/trpc/[trpc]/route.ts` |
| **tRPC Server** | 业务逻辑处理 | `src/server/api/` |
| **Prisma** | 数据库操作 | `prisma/schema.prisma` |
| **NextAuth** | 用户认证 | `src/server/auth/` |

#### 11.3.2 数据流向
```
用户操作 → React 组件 → tRPC Client → HTTP 请求 → App Router → tRPC Server → Prisma → 数据库
```

## 12. 完整示例：用户登录后的增删改查功能

### 12.1 场景描述
用户登录后，在帖子管理页面进行以下操作：
- 查看帖子列表
- 创建新帖子
- 编辑现有帖子
- 删除帖子

### 12.2 完整工作流程

#### 12.2.1 1. 用户认证流程
```typescript
// 1. 用户点击登录按钮
// src/app/page.tsx
import { signIn, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  
  if (!session) {
    return (
      <button onClick={() => signIn("google")}>
        登录
      </button>
    );
  }
  
  return <PostManagement />;
}

// 2. 认证请求流程
// 用户点击登录 → app/api/auth/[...nextauth]/route.ts → server/auth/index.ts → Google OAuth → 创建会话
```

#### 12.2.2 2. 查看帖子列表
```typescript
// 1. 页面组件调用 tRPC
// src/app/posts/page.tsx
import { api } from "@/trpc/react";

export default function PostsPage() {
  const { data: posts, isLoading } = api.post.getAll.useQuery();
  
  if (isLoading) return <div>加载中...</div>;
  
  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>{post.name}</div>
      ))}
    </div>
  );
}

// 2. tRPC 客户端发送请求
// src/trpc/react.tsx → 发送 HTTP 请求到 /api/trpc/post.getAll

// 3. App Router 处理请求
// app/api/trpc/[trpc]/route.ts
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,  // 使用 server/api/root.ts 中的路由器
    createContext: () => createContext(req),
  });

// 4. tRPC Server 处理业务逻辑
// server/api/routers/post.ts
export const postRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // 验证用户已登录
    // ctx.session.user 包含当前用户信息
    
    // 调用 Prisma 查询数据库
    return ctx.db.post.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      orderBy: { createdAt: "desc" },
    });
  }),
});

// 5. Prisma 执行数据库查询
// server/db.ts → Prisma Client → MySQL 数据库
// 返回类型安全的数据
```

#### 12.2.3 3. 创建新帖子
```typescript
// 1. 页面组件
// src/app/posts/create/page.tsx
import { api } from "@/trpc/react";
import { useState } from "react";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      // 创建成功后跳转或刷新列表
      router.push("/posts");
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({ name: title });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="帖子标题"
      />
      <button type="submit">创建帖子</button>
    </form>
  );
}

// 2. tRPC 路由处理
// server/api/routers/post.ts
export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // 验证输入数据
      // 确保用户已登录
      
      // 创建帖子并关联到当前用户
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
});

// 3. Prisma 执行插入操作
// 自动生成 SQL: INSERT INTO Post (name, createdById, createdAt) VALUES (?, ?, NOW())
```

#### 12.2.4 4. 编辑帖子
```typescript
// 1. 页面组件
// src/app/posts/[id]/edit/page.tsx
import { api } from "@/trpc/react";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { data: post } = api.post.getById.useQuery({ id: params.id });
  const updatePost = api.post.update.useMutation();
  
  const handleUpdate = (name: string) => {
    updatePost.mutate({ id: params.id, name });
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleUpdate(formData.get("name") as string);
    }}>
      <input name="name" defaultValue={post?.name} />
      <button type="submit">更新</button>
    </form>
  );
}

// 2. tRPC 路由处理
// server/api/routers/post.ts
export const postRouter = createTRPCRouter({
  update: protectedProcedure
    .input(z.object({ 
      id: z.string(), 
      name: z.string().min(1) 
    }))
    .mutation(async ({ ctx, input }) => {
      // 验证用户权限（只能编辑自己的帖子）
      const post = await ctx.db.post.findFirst({
        where: { 
          id: input.id, 
          createdBy: { id: ctx.session.user.id } 
        },
      });
      
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      
      // 更新帖子
      return ctx.db.post.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
});
```

#### 12.2.5 5. 删除帖子
```typescript
// 1. 页面组件
// src/app/posts/page.tsx
export default function PostsPage() {
  const { data: posts, refetch } = api.post.getAll.useQuery();
  const deletePost = api.post.delete.useMutation({
    onSuccess: () => refetch(),
  });
  
  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>
          {post.name}
          <button onClick={() => deletePost.mutate({ id: post.id })}>
            删除
          </button>
        </div>
      ))}
    </div>
  );
}

// 2. tRPC 路由处理
// server/api/routers/post.ts
export const postRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // 验证用户权限
      const post = await ctx.db.post.findFirst({
        where: { 
          id: input.id, 
          createdBy: { id: ctx.session.user.id } 
        },
      });
      
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      
      // 删除帖子
      return ctx.db.post.delete({
        where: { id: input.id },
      });
    }),
});
```

### 12.3 关键技术点

#### 12.3.1 类型安全
```typescript
// 整个流程都是类型安全的
// 1. Prisma 生成类型
// 2. tRPC 服务器使用这些类型
// 3. 客户端自动获得类型提示
// 4. 编译时检查确保类型一致
```

#### 12.3.2 认证和授权
```typescript
// 1. NextAuth.js 处理用户认证
// 2. tRPC 中间件验证会话
// 3. 业务逻辑层检查用户权限
// 4. 数据库查询确保数据隔离
```

#### 12.3.3 错误处理
```typescript
// 1. Zod 验证输入数据
// 2. tRPC 统一错误格式
// 3. 前端优雅处理错误
// 4. 开发环境详细错误信息
```

### 12.4 性能优化

#### 12.4.1 缓存策略
```typescript
// 1. React Query 缓存查询结果
// 2. 乐观更新提升用户体验
// 3. 后台重新验证保持数据新鲜
```

#### 12.4.2 数据库优化
```typescript
// 1. Prisma 查询优化
// 2. 索引提升查询性能
// 3. 分页处理大量数据
```

这个架构的优势在于：
- **类型安全**：从数据库到前端全链路类型安全
- **开发效率**：自动生成类型，减少手动维护
- **性能优化**：内置缓存和优化机制
- **可维护性**：清晰的职责分离和模块化设计 