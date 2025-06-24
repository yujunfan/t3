# Create T3 App 功能目录结构

## 项目根目录

```
t3/
├── .git/                    # Git 版本控制目录
├── .cursor/                 # Cursor IDE 配置目录
├── .next/                   # Next.js 构建输出目录
├── node_modules/            # 依赖包目录
├── prisma/                  # Prisma ORM 配置目录
├── public/                  # 静态资源目录
├── src/                     # 源代码目录
├── .gitignore              # Git 忽略文件配置
├── .npmrc                  # npm 配置文件
├── eslint.config.js        # ESLint 代码规范配置
├── next-env.d.ts           # Next.js TypeScript 环境声明
├── next.config.js          # Next.js 配置文件
├── package.json            # 项目依赖和脚本配置
├── pnpm-lock.yaml          # pnpm 锁文件
├── postcss.config.js       # PostCSS 配置
├── prettier.config.js      # Prettier 代码格式化配置
├── README.md               # 项目说明文档
├── start-database.sh       # 数据库启动脚本
└── tsconfig.json           # TypeScript 配置
```

## 核心目录详解

### `/prisma/` - 数据库 ORM 配置
```
prisma/
└── schema.prisma           # Prisma 数据库模式定义
```
- **作用**: 定义数据库表结构、关系和模型
- **包含**: User、Post、Account、Session、VerificationToken 等模型
- **功能**: 支持 NextAuth.js 认证和博客文章功能

### `/src/` - 源代码目录
```
src/
├── app/                    # Next.js 13+ App Router
├── env.js                  # 环境变量验证配置
├── server/                 # 服务端代码
├── styles/                 # 样式文件
└── trpc/                   # tRPC 客户端配置
```

#### `/src/app/` - Next.js App Router
```
app/
├── _components/            # 页面组件
│   └── post.tsx           # 文章组件
├── api/                   # API 路由
│   ├── auth/              # 认证相关 API
│   │   └── [...nextauth]/ # NextAuth.js 路由
│   └── trpc/              # tRPC API 路由
│       └── [trpc]/        # tRPC 处理器
├── layout.tsx             # 根布局组件
└── page.tsx               # 首页组件
```

#### `/src/server/` - 服务端代码
```
server/
├── api/                   # tRPC API 定义
│   ├── routers/           # API 路由定义
│   │   └── post.ts        # 文章相关 API
│   ├── root.ts            # tRPC 根路由
│   └── trpc.ts            # tRPC 配置
├── auth/                  # 认证配置
│   ├── config.ts          # NextAuth.js 配置
│   └── index.ts           # 认证导出
└── db.ts                  # 数据库连接配置
```

#### `/src/trpc/` - tRPC 客户端配置
```
trpc/
├── query-client.ts        # React Query 客户端配置
├── react.tsx              # tRPC React 集成
└── server.ts              # tRPC 服务端配置
```

#### `/src/styles/` - 样式文件
```
styles/
└── globals.css            # 全局样式文件
```

### `/public/` - 静态资源
```
public/
└── favicon.ico            # 网站图标
```

## 配置文件详解

### 核心配置文件
- **`package.json`**: 项目依赖、脚本和元数据
- **`tsconfig.json`**: TypeScript 编译配置
- **`next.config.js`**: Next.js 框架配置
- **`eslint.config.js`**: 代码质量检查配置
- **`prettier.config.js`**: 代码格式化配置
- **`postcss.config.js`**: CSS 处理配置

### 环境配置
- **`src/env.js`**: 环境变量验证和类型安全
- **`.env`**: 环境变量文件（需要手动创建）

### 数据库配置
- **`prisma/schema.prisma`**: 数据库模式定义
- **`start-database.sh`**: 数据库启动脚本

## 技术栈集成

### 前端技术
- **Next.js 15**: React 全栈框架
- **React 19**: 用户界面库
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架

### 后端技术
- **tRPC**: 类型安全的 API 层
- **Prisma**: 数据库 ORM
- **NextAuth.js**: 认证系统
- **Zod**: 数据验证

### 开发工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **pnpm**: 包管理器

## 数据流架构

```
客户端 (React) 
    ↓
tRPC 客户端 (/src/trpc/)
    ↓
API 路由 (/src/app/api/trpc/)
    ↓
tRPC 服务端 (/src/server/api/)
    ↓
数据库 (Prisma + MySQL)
```

## 认证流程

```
用户登录
    ↓
NextAuth.js (/src/server/auth/)
    ↓
Prisma 适配器
    ↓
数据库存储用户信息
``` 