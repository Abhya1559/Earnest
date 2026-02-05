"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      toast.success("Welcome back!");
      window.location.href = "/dashboard";
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-20">
      <div className="w-full max-w-110 bg-[#111] border border-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl transition-all">
        <div className="space-y-2 mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to continue to TaskManager.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              className="w-full bg-black/50 border border-white/10 p-3.5 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-black/50 border border-white/10 p-3.5 rounded-2xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold p-4 rounded-2xl hover:bg-blue-400 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-white font-semibold hover:underline underline-offset-4"
          >
            Join now
          </Link>
        </p>
      </div>
    </div>
  );
}
