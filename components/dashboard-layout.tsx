"use client"

import { useState, type ReactNode, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Users,
  Building2,
  Home,
  Calendar,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Dynamically import UpcomingEvents to reduce initial load time
const UpcomingEvents = dynamic(() => import("@/components/upcoming-events").then(mod => mod.UpcomingEvents), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 rounded-lg bg-muted"></div>
})

interface DashboardLayoutProps {
  children: ReactNode
  role: "student" | "club" | "admin"
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { setTheme } = useTheme()

  // Enforce dark theme for all dashboard pages
  useEffect(() => {
    // Set theme to dark
    setTheme('dark')
    document.documentElement.classList.add("dark")
    
    return () => {
      // No need to remove the dark class when navigating away
      // as this would only be called when leaving all dashboard pages
    }
  }, [setTheme])

  // Redirect if not logged in or wrong role
  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?role=${role}`)
    }
  }, [user, isLoading, router, role])

  // Memoize these functions to prevent recreating on each render
  const getRoleIcon = useCallback(() => {
    switch (role) {
      case "student":
        return <GraduationCap className="h-6 w-6" />
      case "club":
        return <Users className="h-6 w-6" />
      case "admin":
        return <Building2 className="h-6 w-6" />
    }
  }, [role])

  const getRoleName = useCallback(() => {
    switch (role) {
      case "student":
        return "Student Dashboard"
      case "club":
        return "Club Dashboard"
      case "admin":
        return "Admin Dashboard"
    }
  }, [role])

  const navItems = useMemo<NavItem[]>(() => {
    switch (role) {
      case "student":
        return [
          { href: "/dashboard/student", label: "Overview", icon: Home },
          { href: "/dashboard/student/events", label: "My Events", icon: Calendar },
          { href: "/dashboard/student/points", label: "Activity Points", icon: Award },
          { href: "/dashboard/student/settings", label: "Settings", icon: Settings },
        ]
      case "club":
        return [
          { href: "/dashboard/club", label: "Overview", icon: Home },
          { href: "/dashboard/club/events", label: "Manage Events", icon: Calendar },
          { href: "/dashboard/club/create", label: "Create Event", icon: Award },
          { href: "/dashboard/club/settings", label: "Settings", icon: Settings },
        ]
      case "admin":
      default:
        return [
          { href: "/dashboard/admin", label: "Overview", icon: Home },
          { href: "/dashboard/admin/students", label: "Students", icon: GraduationCap },
          { href: "/dashboard/admin/events", label: "Events", icon: Calendar },
          { href: "/dashboard/admin/clubs", label: "Clubs", icon: Users },
          { href: "/dashboard/admin/api", label: "API Docs", icon: FileText },
          { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
        ]
    }
  }, [role])

  const handleLogout = useCallback(() => {
    setMobileMenuOpen(false)
    logout()
  }, [logout])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  // If still loading or no user, show minimal loading state
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center dark">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 rounded-md bg-muted mx-auto mb-4"></div>
          <div className="h-4 w-48 rounded-md bg-muted mx-auto"></div>
        </div>
      </div>
    )
  }

  const roleIcon = getRoleIcon()
  const roleName = getRoleName()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen dark">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="flex items-center gap-2 px-4 py-2">
            {roleIcon}
            <span className="text-lg font-bold">{roleName}</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item: NavItem) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Theme</span>
                </div>
                <ThemeToggle />
              </div>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex items-center gap-2">
              {roleIcon}
              <span className="font-semibold">{roleName}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <SidebarTrigger className="md:hidden" />
            </div>
          </header>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 top-16 z-20 bg-background md:hidden">
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item: NavItem) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <Button
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-muted mt-4"
                  variant="ghost"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </nav>
            </div>
          )}

          {/* Content Area */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

