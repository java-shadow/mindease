"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageCircle, BookOpen, BarChart3, Calendar, User, LogOut, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chatbot", label: "Chatbot", icon: MessageCircle, requiresAuth: true },
  { href: "/journal", label: "Journal", icon: BookOpen, requiresAuth: true },
  { href: "/mood", label: "Mood", icon: BarChart3, requiresAuth: true },
  { href: "/book", label: "Book", icon: Calendar, requiresAuth: true },
]

export default function Navigation() {
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold text-slate-800">
            MindEase
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              // Hide protected routes if not authenticated
              if (item.requiresAuth && !isAuthenticated) return null

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 ml-2 pl-2 border-l border-slate-200">
                <Link
                  href="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/profile"
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.name || "Profile"}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-2 pl-2 border-l border-slate-200"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
