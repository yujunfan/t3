/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

// 导入必要的依赖包
import { initTRPC, TRPCError } from "@trpc/server"; // tRPC 核心功能，用于创建类型安全的 API
import superjson from "superjson"; // 用于序列化/反序列化数据，支持 Date、BigInt 等特殊类型
import { ZodError } from "zod"; // Zod 验证库的错误类型，用于处理数据验证错误

import { auth } from "@/server/auth"; // 导入认证配置
import { db } from "@/server/db"; // 导入数据库连接

/**
 * 第一部分：上下文（CONTEXT）
 * 
 * 这部分定义了后端 API 中可用的"上下文"。
 * 
 * 上下文允许你在处理请求时访问各种资源，比如数据库、用户会话等。
 * 
 * 这个辅助函数生成 tRPC 上下文的"内部结构"。API 处理器和 RSC 客户端都会包装这个函数
 * 并提供所需的上下文。
 * 
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  // 获取当前用户的会话信息
  const session = await auth();

  // 返回上下文对象，包含数据库连接、用户会话和请求头信息
  return {
    db,        // 数据库连接实例
    session,   // 用户会话信息
    ...opts,   // 展开其他选项（如请求头）
  };
};

/**
 * 第二部分：初始化（INITIALIZATION）
 * 
 * 这里是 tRPC API 的初始化部分，连接上下文和转换器。我们还解析 ZodErrors，
 * 这样当你的程序因后端验证错误而失败时，前端也能获得类型安全。
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  // 使用 superjson 作为数据转换器，支持复杂数据类型的序列化
  transformer: superjson,
  // 自定义错误格式化器
  errorFormatter({ shape, error }) {
    return {
      ...shape, // 保留原始错误形状
      data: {
        ...shape.data,
        // 如果是 Zod 验证错误，将其扁平化处理
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 创建服务器端调用器。
 * 
 * 这允许你在服务器端直接调用 tRPC 程序，而不需要通过 HTTP 请求。
 * 
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 第三部分：路由器和程序（ROUTER & PROCEDURE）
 * 
 * 这些是你用来构建 tRPC API 的核心组件。你应该在 "/src/server/api/routers" 
 * 目录中大量导入这些组件。
 */

/**
 * 这是你创建新路由器和子路由器的方式。
 * 
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * 计时中间件：用于计时程序执行时间并在开发环境中添加人工延迟。
 * 
 * 如果你不喜欢这个功能可以删除，但它可以通过模拟网络延迟来帮助捕获不必要的水fall，
 * 这种延迟在生产环境中会出现，但在本地开发中不会出现。
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now(); // 记录开始时间

  if (t._config.isDev) {
    // 在开发环境中添加人工延迟（100-500ms 随机延迟）
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next(); // 执行下一个中间件或程序

  const end = Date.now(); // 记录结束时间
  // 输出执行时间日志
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * 公共程序（未认证）
 * 
 * 这是你用来在 tRPC API 上构建新查询和变更的基础组件。它不保证查询的用户已授权，
 * 但如果用户已登录，你仍然可以访问用户会话数据。
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * 受保护的程序（已认证）
 * 
 * 如果你希望查询或变更只对已登录用户可访问，请使用这个。它验证会话是否有效，
 * 并保证 `ctx.session.user` 不为 null。
 * 
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware) // 使用计时中间件
  .use(({ ctx, next }) => {
    // 检查用户是否已登录
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" }); // 抛出未授权错误
    }
    // 如果用户已登录，继续执行并确保会话用户信息不为空
    return next({
      ctx: {
        // 推断 `session` 为非空类型
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
