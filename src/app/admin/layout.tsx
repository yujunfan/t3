import Link from "next/link";
import { cn } from "@/lib/utils"; // shadcn/ui 的工具函数
import { Button } from "@/components/ui/button";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb'

// 加载占位符组件
function LoadingPlaceholder() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* 页面标题和按钮占位 */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
      
      {/* 统计卡片占位 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
        <div className="rounded-lg border p-4">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
        <div className="rounded-lg border p-4">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
      
      {/* 内容区域占位 */}
      <div className="rounded-lg border">
        <div className="p-4">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="border-t p-4">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb />
        </div>
      </header>
      <Suspense fallback={<LoadingPlaceholder />}>
        {children}
      </Suspense>
    </SidebarInset>
  </SidebarProvider>
  );
}
