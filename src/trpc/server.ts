import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { createCaller, type AppRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createQueryClient } from "./query-client";

/**
 * 创建 tRPC 上下文的缓存函数
 * 这个函数包装了 createTRPCContext 助手，为 React Server Component 中的 tRPC API 调用
 * 提供所需的上下文信息
 * 
 * 使用 cache 函数确保在同一个请求中多次调用时返回相同的结果
 */
const createContext = cache(async () => {
  // 获取当前请求的头部信息
  const heads = new Headers(await headers());
  // 设置 tRPC 来源标识为 "rsc"（React Server Component）
  heads.set("x-trpc-source", "rsc");

  // 创建并返回 tRPC 上下文，包含处理后的头部信息
  return createTRPCContext({
    headers: heads,
  });
});

// 缓存查询客户端创建函数，确保在同一个请求中使用相同的客户端实例
const getQueryClient = cache(createQueryClient);

// 创建 tRPC 调用器，使用缓存的上下文创建函数
const caller = createCaller(createContext);

// 创建水合助手，包含 tRPC API 和客户端水合组件
// 这些助手用于在 React Server Components 中使用 tRPC
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  // 传入 tRPC 调用器
  caller,
  // 传入查询客户端创建函数
  getQueryClient,
);
