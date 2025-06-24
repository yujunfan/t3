import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

/**
 * 创建查询客户端的工厂函数
 * 配置了适合 SSR（服务器端渲染）的默认选项
 * 
 * @returns 配置好的 QueryClient 实例
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // 设置查询的过期时间为 30 秒
        // 在 SSR 环境中，设置 staleTime > 0 可以避免客户端立即重新获取数据
        // 这提高了性能并减少了不必要的网络请求
        staleTime: 30 * 1000, // 30 秒 = 30,000 毫秒
      },
      // 脱水（序列化）相关的配置
      // 用于将查询状态序列化，以便在服务器端渲染时传递给客户端
      dehydrate: {
        // 使用 SuperJSON 序列化数据，支持复杂数据类型
        serializeData: SuperJSON.serialize,
        // 自定义查询脱水判断逻辑
        shouldDehydrateQuery: (query) =>
          // 使用默认的脱水判断逻辑
          defaultShouldDehydrateQuery(query) ||
          // 或者查询状态为 pending（进行中）时也进行脱水
          // 这确保正在进行的查询也能被序列化到客户端
          query.state.status === "pending",
      },
      // 水合（反序列化）相关的配置
      // 用于在客户端恢复序列化的查询状态
      hydrate: {
        // 使用 SuperJSON 反序列化数据，与序列化过程对应
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
