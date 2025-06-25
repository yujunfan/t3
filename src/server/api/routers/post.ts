/**
 * 帖子路由器 (Post Router)
 * 
 * 这个文件定义了所有与帖子相关的 API 端点，包括：
 * - hello: 公共端点，用于测试问候功能
 * - create: 受保护端点，创建新帖子
 * - getLatest: 受保护端点，获取用户最新帖子
 * - getSecretMessage: 受保护端点，获取秘密消息
 * 
 * 使用 tRPC 提供类型安全的 API 调用
 */

// 导入 Zod 验证库，用于输入数据的类型验证和模式定义
import { z } from "zod";

// 从 tRPC 配置文件中导入创建路由器、受保护程序和公共程序的基础函数
import {
  createTRPCRouter,    // 用于创建 tRPC 路由器
  protectedProcedure,   // 需要用户登录才能访问的程序
  publicProcedure,      // 任何人都可以访问的程序
} from "@/server/api/trpc";

// 创建帖子路由器，包含所有与帖子相关的 API 端点
export const postRouter = createTRPCRouter({
  // 公共端点：hello - 简单的问候功能，任何人都可以访问
  hello: publicProcedure
    // 定义输入验证模式：需要一个包含 text 字符串字段的对象
    .input(z.object({ text: z.string() }))
    // 查询函数：接收输入参数并返回问候语
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`, // 返回格式化的问候语
      };
    }),

  // 受保护端点：create - 创建新帖子，需要用户登录
  create: protectedProcedure
    // 定义输入验证模式：需要一个包含 name 字段的对象，且 name 不能为空
    .input(z.object({ name: z.string().min(1) }))
    // 变更函数：异步创建新帖子到数据库
    .mutation(async ({ ctx, input }) => {
      // 使用数据库上下文创建新帖子
      return ctx.db.post.create({
        data: {
          name: input.name, // 设置帖子名称
          // 将帖子关联到当前登录用户
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // 受保护端点：getLatest - 获取当前用户的最新帖子
  getLatest: protectedProcedure
    // 查询函数：异步获取数据库中的最新帖子
    .query(async ({ ctx }) => {
      // 查询数据库，查找当前用户创建的最新帖子
      const post = await ctx.db.post.findFirst({
        orderBy: { createdAt: "desc" }, // 按创建时间降序排列
        where: { createdBy: { id: ctx.session.user.id } }, // 只查询当前用户的帖子
      });

      // 如果没有找到帖子则返回 null，否则返回帖子对象
      return post ?? null;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany();
  }),

  // 受保护端点：getSecretMessage - 获取秘密消息，需要用户登录
  getSecretMessage: protectedProcedure
    // 查询函数：返回一个简单的秘密消息
    .query(() => {
      return "you can now see this secret message!"; // 返回秘密消息
    }),
});
