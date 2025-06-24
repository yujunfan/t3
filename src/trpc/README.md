# tRPC 服务器端集成详解

## 📋 概述

`server.ts` 文件是 T3 Stack 中 tRPC 与 React Server Components (RSC) 集成的核心文件。它提供了在服务器端组件中安全、高效地使用 tRPC API 的能力。

## 🏗️ 文件结构

```
src/trpc/
├── server.ts          # 服务器端 tRPC 集成
├── react.tsx          # 客户端 tRPC 集成
├── query-client.ts    # 查询客户端配置
└── README.md          # 本文档
```

## 🔧 核心组件

### 1. **server-only 安全声明**
```typescript
import "server-only";
```
- **作用**: 确保文件只能在服务器端运行
- **安全**: 防止客户端代码意外导入服务器端逻辑
- **类型安全**: 提供编译时检查

### 2. **React Server Components 水合助手**
```typescript
import { createHydrationHelpers } from "@trpc/react-query/rsc";
```
- **功能**: 创建专门用于 RSC 的 tRPC 助手
- **水合**: 将服务器端状态传递到客户端
- **类型安全**: 保持完整的 TypeScript 类型推断

### 3. **Next.js 集成**
```typescript
import { headers } from "next/headers";
import { cache } from "react";
```
- **headers**: 获取请求头信息
- **cache**: React 的缓存机制，优化性能

## 🎯 核心功能

### **上下文创建与缓存**
```typescript
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  
  return createTRPCContext({
    headers: heads,
  });
});
```

**工作原理**:
1. **获取请求头**: 从 Next.js 获取当前请求的头部信息
2. **设置来源标识**: 标记请求来自 React Server Component
3. **创建上下文**: 使用处理后的头部创建 tRPC 上下文
4. **缓存结果**: 确保同一请求中多次调用返回相同结果

### **查询客户端缓存**
```typescript
const getQueryClient = cache(createQueryClient);
```
- **性能优化**: 避免重复创建查询客户端
- **内存效率**: 同一请求中共享客户端实例
- **状态一致性**: 确保查询状态的一致性

### **tRPC 调用器**
```typescript
const caller = createCaller(createContext);
```
- **类型安全**: 提供完整的 TypeScript 类型推断
- **上下文注入**: 自动注入服务器端上下文
- **错误处理**: 统一的错误处理机制

## 🌊 水合机制

### **导出组件**
```typescript
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
```

**两个核心导出**:

1. **`trpc: api`** - 服务器端 tRPC API
   - 用于在 RSC 中直接调用 tRPC 路由
   - 提供类型安全的 API 调用
   - 支持异步操作

2. **`HydrateClient`** - 客户端水合组件
   - 将服务器端状态传递到客户端
   - 避免客户端重复请求
   - 提供无缝的 SSR 体验

## 🔄 工作流程

### **服务器端渲染流程**
```
1. 请求到达 Next.js
   ↓
2. React Server Component 执行
   ↓
3. 调用 trpc.api 获取数据
   ↓
4. 数据被序列化并传递给客户端
   ↓
5. HydrateClient 在客户端恢复状态
   ↓
6. 客户端组件使用缓存的数据
```

### **数据流**
```
服务器端组件
    ↓ (trpc.api 调用)
tRPC 路由
    ↓ (数据库查询)
数据返回
    ↓ (序列化)
客户端组件
    ↓ (HydrateClient)
React Query 缓存
```

## 💡 使用示例

### **在 RSC 中使用**
```typescript
// app/page.tsx
import { api } from "@/trpc/server";

export default async function Page() {
  // 在服务器端直接调用 tRPC API
  const posts = await api.post.getAll();
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### **客户端水合**
```typescript
// app/layout.tsx
import { HydrateClient } from "@/trpc/server";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <HydrateClient>
          {children}
        </HydrateClient>
      </body>
    </html>
  );
}
```

## 🚀 性能优势

### **1. 缓存优化**
- **请求级缓存**: 同一请求中避免重复调用
- **查询客户端缓存**: 共享客户端实例
- **React 缓存**: 利用 React 的缓存机制

### **2. 网络优化**
- **减少客户端请求**: 服务器端预获取数据
- **批量处理**: 支持批量 API 调用
- **智能水合**: 只传递必要的数据

### **3. 类型安全**
- **端到端类型**: 从服务器到客户端的完整类型安全
- **编译时检查**: 提前发现类型错误
- **自动补全**: IDE 提供完整的代码补全

## 🔒 安全特性

### **1. 服务器端隔离**
- `server-only` 确保代码不会泄露到客户端
- 敏感逻辑保持在服务器端

### **2. 上下文安全**
- 自动注入认证信息
- 请求头验证
- 来源标识追踪

### **3. 错误处理**
- 统一的错误处理机制
- 安全的错误信息传递
- 开发环境调试支持

## 🛠️ 配置选项

### **环境变量**
```env
# 开发环境调试
NODE_ENV=development

# 生产环境优化
NODE_ENV=production
```

### **自定义配置**
- 可以自定义 `createContext` 逻辑
- 支持中间件注入
- 可扩展的查询客户端配置

## 📚 最佳实践

### **1. 数据获取策略**
- 在 RSC 中预获取关键数据
- 使用客户端组件处理交互逻辑
- 合理使用缓存策略

### **2. 错误处理**
- 在服务器端处理数据获取错误
- 在客户端处理用户交互错误
- 提供友好的错误信息

### **3. 性能优化**
- 避免在 RSC 中进行不必要的计算
- 合理使用缓存机制
- 监控和优化查询性能

## 🔍 调试技巧

### **开发环境**
- 启用 tRPC 日志记录
- 使用 React DevTools 检查组件状态
- 监控网络请求和响应

### **生产环境**
- 使用性能监控工具
- 分析缓存命中率
- 监控错误率和响应时间

## 📖 相关文档

- [tRPC 官方文档](https://trpc.io/)
- [React Server Components](https://nextjs.org/docs/app)
- [React Query](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)

---

这个服务器端集成是 T3 Stack 中实现类型安全、高性能 SSR 的关键组件，为现代 React 应用提供了强大的数据获取和状态管理能力。 