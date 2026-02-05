"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    /* ================= AUTH CHECK ================= */
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // Initial check
    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    setIsLoggedIn(false);

    router.push("/login");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-black py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* ================= LOGO ================= */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
            T
          </div>

          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 group-hover:to-white transition-all">
            TaskManager
          </span>
        </Link>

        {/* ================= NAV LINKS ================= */}
        <div className="flex gap-6 items-center">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white px-4 py-2 rounded-full border border-white/10 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 shadow-lg shadow-white/5 transition-transform active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
