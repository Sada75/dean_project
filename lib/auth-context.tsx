"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authenticateUser } from "@/lib/data"

interface User {
  id: string
  name: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  role: string | null
  login: (email: string, password: string, role: string) => Promise<{ success: boolean; message?: string; dashboardPath?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem("user")
    const storedRole = localStorage.getItem("role")

    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: string) => {
    // Authenticate user
    const result = authenticateUser(email, password, role)

    if (result.success && result.user && result.role) {
      setUser(result.user)
      setRole(result.role)

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(result.user))
      localStorage.setItem("role", result.role)

      // Route dean to admin dashboard but keep the role as dean for UI display
      const dashboardPath = result.role === "dean" ? "admin" : result.role
      
      return { success: true, dashboardPath }
    }

    return { success: false, message: result.message || "Invalid credentials" }
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

