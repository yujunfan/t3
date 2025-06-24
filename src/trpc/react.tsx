"use client"; // 声明这是一个客户端组件，可以在浏览器中运行

// 导入 React Query 的核心组件和类型，用于状态管理和缓存
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
// 导入 tRPC 客户端的链接器，用于网络通信和日志记录
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
// 导入 tRPC React 集成库，用于在 React 中使用 tRPC
import { createTRPCReact } from "@trpc/react-query";
// 导入类型推断工具，用于从服务器路由自动生成 TypeScript 类型
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
// 导入 React 的 useState hook，用于组件状态管理
import { useState } from "react";
// 导入 SuperJSON，用于序列化复杂数据类型（如 Date、BigInt、Map、Set 等）
import SuperJSON from "superjson";

// 导入应用的主路由类型定义，这是 tRPC 的类型安全基础
import { type AppRouter } from "@/server/api/root";
// 导入查询客户端创建函数，用于创建 React Query 客户端
import { createQueryClient } from "./query-client";

// 声明一个全局变量，用于在客户端存储 QueryClient 实例（单例模式）
let clientQueryClientSingleton: QueryClient | undefined = undefined;

/**
 * 获取 QueryClient 实例的函数
 * 使用单例模式确保在客户端只有一个 QueryClient 实例，避免重复创建
 */
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // 在服务器端：总是创建一个新的查询客户端
    // 因为服务器端渲染时每个请求都需要独立的客户端实例
    return createQueryClient();
  }
  // 在浏览器端：使用单例模式保持同一个查询客户端
  // 这样可以避免重复创建客户端，提高性能并保持状态一致性
  clientQueryClientSingleton ??= createQueryClient();

  return clientQueryClientSingleton;
};

// 创建 tRPC React 客户端，绑定到应用的主路由类型，提供类型安全的 API 调用
export const api = createTRPCReact<AppRouter>();

/**
 * 输入类型推断助手
 * 用于从服务器路由自动生成输入参数的类型，提供完整的类型安全
 * 
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * 输出类型推断助手
 * 用于从服务器路由自动生成返回值的类型，确保前后端类型一致
 * 
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * tRPC React 提供者组件
 * 为整个应用提供 tRPC 客户端和 React Query 的上下文
 * 这是连接前端和后端 API 的核心组件
 * 
 * @param props - 组件属性，包含需要被包装的子组件
 */
export function TRPCReactProvider(props: { children: React.ReactNode }) {
  // 获取查询客户端实例，用于管理 API 请求的缓存和状态
  const queryClient = getQueryClient();

  // 使用 useState 创建 tRPC 客户端，确保在组件生命周期内保持稳定
  // 避免每次渲染都重新创建客户端，提高性能
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        // 日志链接：用于开发环境下的调试和错误日志记录
        loggerLink({
          enabled: (op) =>
            // 在开发环境或发生错误时启用日志，帮助调试
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        // HTTP 批量流链接：用于与服务器进行网络通信
        httpBatchStreamLink({
          // 使用 SuperJSON 作为数据转换器，支持复杂数据类型的序列化
          transformer: SuperJSON,
          // 设置 API 端点 URL，指向 tRPC 服务器
          url: getBaseUrl() + "/api/trpc",
          // 设置请求头，用于标识请求来源和认证
          headers: () => {
            const headers = new Headers();
            // 标识请求来源为 Next.js React 应用
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  // 返回提供者组件，包装子组件，提供 tRPC 和 React Query 的上下文
  return (
    // QueryClientProvider：为应用提供 React Query 的上下文，管理查询缓存和状态
    <QueryClientProvider client={queryClient}>
      {/* api.Provider：为应用提供 tRPC 的上下文，使子组件能够调用 tRPC API */}
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {/* 渲染子组件，这些组件现在可以使用 tRPC hooks */}
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

/**
 * 获取基础 URL 的函数
 * 根据运行环境返回适当的 API 基础地址，支持开发、生产等不同环境
 */
function getBaseUrl() {
  // 如果在浏览器环境中，返回当前页面的域名
  if (typeof window !== "undefined") return window.location.origin;
  // 如果在 Vercel 部署环境中，使用 Vercel 提供的 URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // 默认情况下，使用本地开发服务器地址，端口号从环境变量获取或默认为 3000
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
