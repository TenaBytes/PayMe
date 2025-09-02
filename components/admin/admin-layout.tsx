"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TrendingUp,
  LayoutDashboard,
  Users,
  History,
  Settings,
  LogOut,
  Menu,
  Bell,
  Shield,
  BarChart3,
  Package,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
// import { createClient } from "@/lib/supabase/client"
// import type { User as SupabaseUser } from "@supabase/supabase-js"

interface AdminLayoutProps {
  children: React.ReactNode
  user?: any
  profile?: any
}

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Investments", href: "/admin/investments", icon: TrendingUp },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Transactions", href: "/admin/transactions", icon: History },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminLayout({ children, user, profile }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const createSupabaseClient = () => {
    try {
      const { createClient } = require("@/lib/supabase/client")
      return createClient()
    } catch (error) {
      console.log("[v0] Supabase not available, using fallback auth")
      return null
    }
  }

  const handleSignOut = async () => {
    const supabase = createSupabaseClient()

    if (supabase) {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.log("[v0] Supabase sign out failed, using fallback")
      }
    }

    // Clear any local storage admin data
    localStorage.removeItem("adminCredentials")
    router.push("/")
  }

  const getInitials = (name?: string) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || "A"
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
  }

  const userEmail = user?.email || "admin@wealthnexus.com"

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-2">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold">WealthNexus Admin</span>
            <div className="text-xs text-muted-foreground">Management Portal</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="border-t p-4 space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</div>
        <Button asChild variant="outline" size="sm" className="w-full justify-start bg-transparent">
          <Link href="/dashboard">
            <TrendingUp className="mr-2 h-4 w-4" />
            User View
          </Link>
        </Button>
      </div>

      {/* Admin info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">{getInitials(profile?.full_name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || "Admin"}</p>
            <p className="text-xs text-muted-foreground truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-card">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{getInitials(profile?.full_name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || "Admin"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    User Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
