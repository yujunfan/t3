import { Button } from "@/components/ui/button";

export default function ArticlePage() {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">文章管理</h1>
          <Button>新建文章</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">文章总数</h3>
            <p className="text-2xl font-bold text-blue-600">24</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">已发布</h3>
            <p className="text-2xl font-bold text-green-600">18</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">草稿</h3>
            <p className="text-2xl font-bold text-orange-600">6</p>
          </div>
        </div>
        <div className="rounded-lg border">
          <div className="p-4">
            <h2 className="text-lg font-semibold">最近文章</h2>
          </div>
          <div className="border-t p-4">
            <p className="text-muted-foreground">文章列表功能待实现...</p>
          </div>
        </div>
      </div>
    );
  }