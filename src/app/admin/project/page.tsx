import { Button } from "@/components/ui/button";

export default function ProjectPage() {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">项目管理</h1>
          <Button>新建项目</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">项目总数</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">进行中</h3>
            <p className="text-2xl font-bold text-green-600">8</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">已完成</h3>
            <p className="text-2xl font-bold text-purple-600">4</p>
          </div>
        </div>
        <div className="rounded-lg border">
          <div className="p-4">
            <h2 className="text-lg font-semibold">项目列表</h2>
          </div>
          <div className="border-t p-4">
            <p className="text-muted-foreground">项目列表功能待实现...</p>
          </div>
        </div>
      </div>
    );
  }