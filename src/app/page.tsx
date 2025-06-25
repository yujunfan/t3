import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaCode, FaDatabase, FaCloud, FaMobile } from "react-icons/fa";
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiPrisma, SiPostgresql, SiReact, SiNodedotjs } from "react-icons/si";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();
  const posts = await api.post.getAll();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  // 静态数据
  const personalInfo = {
    name: "张三",
    title: "全栈开发工程师",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "热爱编程的全栈开发者，专注于现代Web技术栈。喜欢探索新技术，构建优雅的用户体验。",
    location: "北京, 中国",
    experience: "5年+",
  };

  const techStack = [
    { name: "React", icon: SiReact, color: "text-blue-500" },
    { name: "Next.js", icon: SiNextdotjs, color: "text-black dark:text-white" },
    { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
    { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-500" },
    { name: "Node.js", icon: SiNodedotjs, color: "text-green-600" },
    { name: "Prisma", icon: SiPrisma, color: "text-blue-800" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "text-blue-700" },
  ];

  const projects = [
    {
      title: "电商平台",
      description: "基于Next.js和Prisma构建的现代化电商平台，支持用户认证、商品管理、订单处理等功能。",
      tech: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
      link: "#",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop"
    },
    {
      title: "任务管理系统",
      description: "团队协作的任务管理工具，支持实时更新、任务分配、进度跟踪等功能。",
      tech: ["React", "Node.js", "Socket.io", "MongoDB"],
      link: "#",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop"
    },
    {
      title: "个人博客系统",
      description: "使用T3 Stack构建的现代化博客系统，支持Markdown编辑、评论系统、SEO优化。",
      tech: ["T3 Stack", "tRPC", "NextAuth", "Prisma"],
      link: "#",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop"
    }
  ];

  const articles = [
    {
      title: "使用T3 Stack构建现代化Web应用",
      excerpt: "探索T3 Stack的强大功能，了解如何快速构建类型安全的全栈应用...",
      date: "2024-01-15",
      readTime: "5分钟",
      tags: ["T3 Stack", "Next.js", "tRPC"]
    },
    {
      title: "TypeScript最佳实践指南",
      excerpt: "分享在实际项目中使用TypeScript的经验和最佳实践，提高代码质量和开发效率...",
      date: "2024-01-10",
      readTime: "8分钟",
      tags: ["TypeScript", "最佳实践"]
    },
    {
      title: "Prisma ORM深度解析",
      excerpt: "深入了解Prisma ORM的核心概念，掌握数据库操作的高级技巧...",
      date: "2024-01-05",
      readTime: "6分钟",
      tags: ["Prisma", "数据库", "ORM"]
    }
  ];

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 导航栏 */}
        <nav className="fixed top-0 z-50 w-full bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {personalInfo.name}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {session ? (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={session.user.image || personalInfo.avatar} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white">{session.user.name}</span>
                    <Link
                      href="/api/auth/signout"
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-300"
                    >
                      退出
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-300 font-medium"
                  >
                    登录
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <div className="pt-20">
          {/* Hero Section */}
          <section className="container mx-auto px-6 py-20">
            <div className="text-center">
              <div className="mb-8">
                <img 
                  src={personalInfo.avatar} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-purple-500/30 shadow-2xl"
                />
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    {personalInfo.name}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-6">{personalInfo.title}</p>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">{personalInfo.bio}</p>
                
                <div className="flex justify-center space-x-6 mb-8">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FaCode className="text-purple-400" />
                    <span>{personalInfo.experience} 经验</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <FaDatabase className="text-blue-400" />
                    <span>{personalInfo.location}</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300">
                    <FaGithub className="text-xl text-white" />
                  </a>
                  <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300">
                    <FaLinkedin className="text-xl text-white" />
                  </a>
                  <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300">
                    <FaTwitter className="text-xl text-white" />
                  </a>
                  <a href="#" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300">
                    <FaEnvelope className="text-xl text-white" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 技术栈 Section */}
          <section className="container mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                技术栈
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
              {techStack.map((tech, index) => (
                <div 
                  key={tech.name}
                  className="group flex flex-col items-center p-6 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <tech.icon className={`text-4xl mb-3 ${tech.color}`} />
                  <span className="text-white text-sm font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 项目 Section */}
          <section className="container mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                精选项目
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div 
                  key={project.title}
                  className="group bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a 
                      href={project.link}
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300"
                    >
                      查看项目 →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 文章 Section */}
          <section className="container mx-auto px-6 py-20">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                最新文章
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <article 
                  key={article.title}
                  className="group bg-white/5 hover:bg-white/10 rounded-xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{article.excerpt}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 登录状态显示 */}
          {session && (
            <section className="container mx-auto px-6 py-20">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">欢迎回来！</h3>
                <div className="flex items-center space-x-4">
                  <img 
                    src={session.user.image || personalInfo.avatar} 
                    alt="User Avatar" 
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="text-white text-lg font-medium">{session.user.name}</p>
                    <p className="text-gray-400">{session.user.email}</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-black/20 border-t border-white/10 py-8">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-400">
              © 2024 {personalInfo.name}. 使用 T3 Stack 构建
            </p>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}
