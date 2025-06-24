# Prisma 数据库 ORM 完整指南

Prisma 是一个现代化的数据库 ORM（对象关系映射）工具，提供类型安全的数据库访问。本文档详细介绍 Prisma 的核心概念和使用方法。

## 目录结构

```
prisma/
├── README.md           # 本文档
├── schema.prisma       # Prisma 模式文件（数据库结构定义）
└── migrations/         # 数据库迁移文件（自动生成）
```

## 1. Prisma 核心概念

### 什么是 Prisma？
- **ORM（对象关系映射）**：将数据库表映射为 TypeScript 对象
- **类型安全**：自动生成类型定义，确保编译时类型检查
- **数据库无关**：支持多种数据库（MySQL、PostgreSQL、SQLite 等）
- **迁移管理**：自动处理数据库结构变更

### 主要组件
- **Prisma Schema**：定义数据库结构和关系
- **Prisma Client**：生成的类型安全数据库客户端
- **Prisma Migrate**：数据库迁移工具
- **Prisma Studio**：可视化数据库管理工具

## 2. Schema 文件详解

### 2.1 生成器配置
```prisma
generator client {
    provider = "prisma-client-js"
}
```
- `provider`：指定生成的客户端类型
- `prisma-client-js`：生成 JavaScript/TypeScript 客户端

### 2.2 数据源配置
```prisma
datasource db {
    provider = "mysql"  // 数据库类型：mysql, postgresql, sqlite, sqlserver
    url      = env("DATABASE_URL")  // 数据库连接字符串
}
```

#### 支持的数据库
- **MySQL**：`provider = "mysql"`
- **PostgreSQL**：`provider = "postgresql"`
- **SQLite**：`provider = "sqlite"`
- **SQL Server**：`provider = "sqlserver"`

#### 连接字符串格式
```bash
# MySQL
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# SQLite
DATABASE_URL="file:./dev.db"

# SQL Server
DATABASE_URL="sqlserver://localhost:1433;database=database_name;user=username;password=password"
```

## 3. 模型（Model）定义

### 3.1 基本模型结构
```prisma
model User {
    id    Int     @id @default(autoincrement())
    email String  @unique
    name  String?
    posts Post[]
}
```

### 3.2 字段类型

#### 标量类型
```prisma
model Example {
    // 整数类型
    intField     Int      @default(0)
    bigIntField  BigInt   @default(0)
    
    // 浮点数类型
    floatField   Float    @default(0.0)
    decimalField Decimal  @db.Decimal(10, 2)
    
    // 字符串类型
    stringField  String   @db.VarChar(255)
    textField    String   @db.Text
    
    // 布尔类型
    boolField    Boolean  @default(false)
    
    // 日期时间类型
    dateField    DateTime @default(now())
    
    // JSON 类型
    jsonField    Json
    
    // 枚举类型
    enumField    Role     @default(USER)
}

enum Role {
    USER
    ADMIN
    MODERATOR
}
```

### 3.3 字段属性

#### 主键和唯一性
```prisma
model User {
    id    Int     @id @default(autoincrement())  // 主键，自增
    email String  @unique                        // 唯一字段
    code  String  @unique @default(cuid())       // 唯一字段，默认生成 cuid
}
```

#### 可选字段
```prisma
model User {
    id    Int     @id @default(autoincrement())
    name  String? // 可选字段（可为 null）
    email String  // 必需字段
}
```

#### 默认值
```prisma
model Post {
    id        Int      @id @default(autoincrement())
    title     String   @default("Untitled")
    published Boolean  @default(false)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt  // 自动更新为当前时间
}
```

## 4. 关系定义

### 4.1 一对一关系
```prisma
model User {
    id      Int      @id @default(autoincrement())
    email   String   @unique
    profile Profile?
}

model Profile {
    id     Int    @id @default(autoincrement())
    bio    String?
    userId Int    @unique  // 一对一关系
    user   User   @relation(fields: [userId], references: [id])
}
```

### 4.2 一对多关系
```prisma
model User {
    id    Int     @id @default(autoincrement())
    email String  @unique
    posts Post[]  // 一个用户可以有多个帖子
}

model Post {
    id       Int    @id @default(autoincrement())
    title    String
    authorId Int
    author   User   @relation(fields: [authorId], references: [id])
}
```

### 4.3 多对多关系
```prisma
model Post {
    id       Int       @id @default(autoincrement())
    title    String
    tags     Tag[]     @relation("PostToTag")
}

model Tag {
    id    Int    @id @default(autoincrement())
    name  String @unique
    posts Post[] @relation("PostToTag")
}
```

### 4.4 自引用关系
```prisma
model Category {
    id          Int        @id @default(autoincrement())
    name        String
    parentId    Int?
    parent      Category?  @relation("CategoryToCategory", fields: [parentId], references: [id])
    children    Category[] @relation("CategoryToCategory")
}
```

## 5. 索引和约束

### 5.1 索引
```prisma
model User {
    id    Int     @id @default(autoincrement())
    email String  @unique
    name  String
    
    @@index([email, name])  // 复合索引
    @@index([name])         // 单字段索引
}
```

### 5.2 唯一约束
```prisma
model User {
    id    Int     @id @default(autoincrement())
    email String  @unique
    name  String
    
    @@unique([email, name])  // 复合唯一约束
}
```

### 5.3 外键约束
```prisma
model Post {
    id       Int    @id @default(autoincrement())
    title    String
    authorId Int
    author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

#### 级联操作
- `onDelete: Cascade`：删除父记录时删除子记录
- `onDelete: SetNull`：删除父记录时将子记录设为 null
- `onDelete: Restrict`：阻止删除有子记录的父记录

## 6. 实际项目示例

基于当前项目的 schema.prisma 文件：

### 6.1 用户认证模型
```prisma
model User {
    id            String    @id @default(cuid())
    name          String?
    email         String?   @unique
    emailVerified DateTime?
    image         String?
    accounts      Account[]
    sessions      Session[]
    posts         Post[]
}

model Account {
    id                       String  @id @default(cuid())
    userId                   String
    type                     String
    provider                 String
    providerAccountId        String
    refresh_token            String? @db.Text
    access_token             String?
    expires_at               Int?
    token_type               String?
    scope                    String?
    id_token                 String?
    session_state            String?
    user                     User    @relation(fields: [userId], references: [id], onDelete: Cascade)
    refresh_token_expires_in Int?

    @@unique([provider, providerAccountId])
}

model Session {
    id           String   @id @default(cuid())
    sessionToken String   @unique
    userId       String
    expires      DateTime
    user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 6.2 业务模型
```prisma
model Post {
    id        Int      @id @default(autoincrement())
    name      String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    createdBy   User   @relation(fields: [createdById], references: [id])
    createdById String

    @@index([name])
}
```

## 7. 常用命令

### 7.1 开发命令
```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库迁移
npx prisma migrate dev --name init

# 应用迁移到数据库
npx prisma migrate deploy

# 重置数据库（开发环境）
npx prisma migrate reset

# 打开 Prisma Studio
npx prisma studio

# 格式化 schema 文件
npx prisma format
```

### 7.2 数据库操作
```bash
# 推送 schema 到数据库（不创建迁移）
npx prisma db push

# 从数据库拉取 schema
npx prisma db pull

# 验证 schema 文件
npx prisma validate
```

## 8. 在代码中使用 Prisma

### 8.1 初始化客户端
```typescript
// src/server/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

### 8.2 基本 CRUD 操作
```typescript
// 创建记录
const user = await db.user.create({
  data: {
    email: "user@example.com",
    name: "John Doe",
  },
});

// 查询记录
const users = await db.user.findMany({
  where: {
    email: {
      contains: "@example.com",
    },
  },
  include: {
    posts: true,
  },
});

// 更新记录
const updatedUser = await db.user.update({
  where: { id: 1 },
  data: {
    name: "Jane Doe",
  },
});

// 删除记录
const deletedUser = await db.user.delete({
  where: { id: 1 },
});
```

### 8.3 关系查询
```typescript
// 包含关系的查询
const userWithPosts = await db.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    },
  },
});

// 嵌套创建
const userWithPost = await db.user.create({
  data: {
    email: "user@example.com",
    name: "John Doe",
    posts: {
      create: [
        {
          title: "My First Post",
          content: "Hello World!",
        },
      ],
    },
  },
  include: {
    posts: true,
  },
});
```

## 9. 最佳实践

### 9.1 Schema 设计
- 使用有意义的字段名和模型名
- 合理使用索引提高查询性能
- 正确设置外键约束和级联操作
- 使用枚举类型限制可选值

### 9.2 性能优化
- 只查询需要的字段（使用 `select`）
- 合理使用 `include` 避免 N+1 查询
- 为常用查询字段添加索引
- 使用分页处理大量数据

### 9.3 安全考虑
- 使用环境变量存储数据库连接字符串
- 在生产环境中禁用查询日志
- 定期备份数据库
- 使用事务确保数据一致性

## 10. 常见问题

### 10.1 迁移冲突
```bash
# 解决迁移冲突
npx prisma migrate resolve --applied migration_name
```

### 10.2 类型错误
```bash
# 重新生成客户端
npx prisma generate
```

### 10.3 数据库连接问题
- 检查 DATABASE_URL 环境变量
- 确认数据库服务正在运行
- 验证用户名和密码正确性

## 11. 资源链接

- [Prisma 官方文档](https://www.prisma.io/docs)
- [Prisma Schema 参考](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client 参考](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma 迁移指南](https://www.prisma.io/docs/concepts/components/prisma-migrate) 