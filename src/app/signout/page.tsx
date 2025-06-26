"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      });
    } catch (error) {
      console.error("登出失败:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-[3rem]">
            确认登出
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            您确定要退出登录吗？
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 rounded-lg font-semibold transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? "登出中..." : "确认登出"}
          </button>
        </div>
      </div>
    </main>
  );
} 