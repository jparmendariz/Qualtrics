"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  LogOut,
  BookOpen,
} from "lucide-react";
import { useAuthStore, getInitials } from "@/lib/store/auth";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: FolderKanban, label: "Proyectos" },
  { href: "/projects/new", icon: PlusCircle, label: "Nuevo" },
  { href: "/resources", icon: BookOpen, label: "Recursos" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Top Navigation Bar - Minimal */}
      <header
        className={`fixed top-0 left-0 right-0 h-20 z-50 transition-all duration-500 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--gray-200)',
        }}
      >
        <div className="h-full container-wide flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-lg">R</span>
              </div>
              <span className="text-xl font-semibold tracking-tight hidden sm:block">
                RX Hub
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-4">
            {/* User */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-medium">
                {getInitials(currentUser.name)}
              </div>
              <span className="text-sm font-medium text-gray-800 hidden sm:block">
                {currentUser.name.split(' ')[0]}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
