'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // 解析路径生成面包屑
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbItems = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1
    
    // 中文映射
    const segmentMap: Record<string, string> = {
      'admin': '管理面板',
      'article': '文章管理',
      'project': '项目管理'
    }
    
    const label = segmentMap[segment] || segment
    
    if (isLast) {
      return (
        <BreadcrumbItem key={href}>
          <BreadcrumbPage>{label}</BreadcrumbPage>
        </BreadcrumbItem>
      )
    }
    
    return (
      <BreadcrumbItem key={href}>
        <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
      </BreadcrumbItem>
    )
  })
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">管理面板</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.length > 1 && <BreadcrumbSeparator />}
        {breadcrumbItems.slice(1)}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 