"use client"

import { useState, type ReactNode, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Bell,
  LucideIcon,
  HeartHandshake,
  Sparkles
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
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// Dynamically import UpcomingEvents to reduce initial load time
const UpcomingEvents = dynamic(() => import("@/components/upcoming-events").then(mod => mod.UpcomingEvents), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 rounded-lg bg-muted"></div>
})

interface DashboardLayoutProps {
  children: ReactNode
  role: "student" | "club" | "admin" | "counsellor" | "dean"
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
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
        return <GraduationCap className="h-6 w-6 text-primary" />
      case "club":
        return <Users className="h-6 w-6 text-primary" />
      case "admin":
        return <Building2 className="h-6 w-6 text-primary" />
      case "dean":
        return <Building2 className="h-6 w-6 text-primary" />
      case "counsellor":
        return <HeartHandshake className="h-6 w-6 text-primary" />
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
      case "dean":
        return "Dean Student Affairs"
      case "counsellor":
        return "Counsellor Dashboard"
    }
  }, [role])

  const navItems = useMemo<NavItem[]>(() => {
    switch (role) {
      case "student":
        return [
          { href: "/dashboard/student", label: "Overview", icon: Home },
          { href: "/dashboard/student/events", label: "My Events", icon: Calendar, badge: 3 },
          { href: "/dashboard/student/points", label: "Activity Points", icon: Award },
          { href: "/dashboard/student/settings", label: "Settings", icon: Settings },
        ]
      case "club":
        return [
          { href: "/dashboard/club", label: "Overview", icon: Home },
          { href: "/dashboard/club/events", label: "Manage Events", icon: Calendar, badge: 5 },
          { href: "/dashboard/club/create", label: "Create Event", icon: Award },
          { href: "/dashboard/club/settings", label: "Settings", icon: Settings },
        ]
      case "counsellor":
        return [
          { href: "/dashboard/counsellor", label: "Overview", icon: Home },
          { href: "/dashboard/counsellor", label: "Students", icon: GraduationCap },
          { href: "/dashboard/counsellor", label: "Certificates", icon: Award },
          { href: "/dashboard/counsellor", label: "Settings", icon: Settings },
        ]
      case "dean":
        return [
          { href: "/dashboard/admin", label: "Overview", icon: Home },
          { href: "/dashboard/admin/students", label: "All Students", icon: GraduationCap },
          { href: "/dashboard/admin/clubs", label: "All Clubs", icon: Users },
          { href: "/dashboard/admin/events", label: "Events", icon: Calendar, badge: 8 },
          { href: "/dashboard/admin/counsellors", label: "Counsellors", icon: HeartHandshake },
          { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
        ]
      case "admin":
      default:
        return [
          { href: "/dashboard/admin", label: "Overview", icon: Home },
          { href: "/dashboard/admin/students", label: "Students", icon: GraduationCap },
          { href: "/dashboard/admin/events", label: "Events", icon: Calendar, badge: 8 },
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
        <Sidebar className="hidden md:flex border-r border-border/40 bg-gradient-to-b from-background to-background/95">
          <SidebarHeader className="flex flex-col items-center gap-2 px-4 py-6 border-b border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <Image 
                src="/images/rvce-logo.png" 
                alt="RVCE Logo" 
                width={36} 
                height={36} 
                className="rounded-md" 
              />
              <span className="text-lg font-bold font-heading">RVCE</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10">
              {roleIcon}
              <span className="text-sm font-medium">{roleName}</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarMenu>
              {navItems.map((item: NavItem) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className={cn(
                      "transition-all duration-200 group",
                      pathname === item.href ? 
                      "bg-primary/10 hover:bg-primary/20 text-primary font-medium" : 
                      "hover:bg-muted/50"
                    )}
                  >
                    <Link href={item.href} className="relative">
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        pathname === item.href && "text-primary"
                      )} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge 
                          className="absolute right-0 top-0 ml-auto bg-primary hover:bg-primary text-xs"
                          variant="secondary"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border/40 px-4 py-4 flex flex-col gap-3">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-destructive/10 hover:text-destructive transition-colors">
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
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex items-center gap-2">
              <Image 
                src="/images/rvce-logo.png" 
                alt="RVCE Logo" 
                width={28} 
                height={28} 
                className="rounded-md" 
              />
              <span className="font-semibold font-heading">{roleName}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
              </Button>
              <SidebarTrigger className="md:hidden" />
            </div>
          </header>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 top-16 z-20 bg-background/95 backdrop-blur-sm md:hidden overflow-y-auto">
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item: NavItem) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium relative",
                      pathname === item.href 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted/50",
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      pathname === item.href && "text-primary"
                    )} />
                    {item.label}
                    {item.badge && (
                      <Badge 
                        className="ml-auto bg-primary hover:bg-primary text-xs"
                        variant="secondary"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
                <Button
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 mt-4"
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
          <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-200">
            {/* Theme Welcome Banner (shown on first visit) */}
            {pathname === "/dashboard/" + role && (
              <motion.div 
                id="theme-banner"
                className="mb-6 rounded-lg overflow-hidden border border-primary/20 bg-primary/5 shadow-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Try the new vibrant theme!</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred appearance using the theme toggle.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <ThemeToggle />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        const banner = document.getElementById('theme-banner');
                        if (banner) {
                          banner.style.display = 'none';
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

