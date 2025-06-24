// 导入帖子路由器模块，这个模块包含了所有与帖子相关的 API 端点
import { postRouter } from "@/server/api/routers/post";

// 从 tRPC 配置文件中导入创建调用器工厂和创建路由器的基础函数
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * 这是你的服务器的主要路由器。
 * 
 * 所有在 /api/routers 目录中添加的路由器都应该手动添加到这里。
 * 这个文件作为所有 API 路由的入口点，将各个功能模块的路由器组合在一起。
 */
export const appRouter = createTRPCRouter({
  // 将帖子路由器挂载到主路由器上，路径为 /post
  // 这意味着所有帖子相关的 API 都会以 /post 为前缀
  post: postRouter,
});

// 导出 API 的类型定义，供前端使用
// 这个类型定义包含了整个 API 的结构，确保前后端类型安全
export type AppRouter = typeof appRouter;

/**
 * 为 tRPC API 创建服务器端调用器。
 * 
 * 这个调用器允许你在服务器端直接调用 tRPC 程序，而不需要通过 HTTP 请求。
 * 主要用于：
 * - 服务器端渲染 (SSR)
 * - 静态站点生成 (SSG)
 * - 服务器端组件 (RSC)
 * 
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
