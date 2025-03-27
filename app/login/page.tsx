"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Users, Building2, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { IntroAnimation } from "@/components/intro-animation"
import { motion } from "framer-motion"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user, role } = useAuth()
  const { toast } = useToast()

  const [loginRole, setLoginRole] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam) {
      setLoginRole(roleParam)
    }

    // If user is already logged in, redirect to appropriate dashboard
    if (user && role) {
      router.push(`/dashboard/${role}`)
    }

    // Force dark theme for this page
    document.documentElement.classList.add("dark")

    return () => {
      document.documentElement.classList.remove("dark")
    }
  }, [searchParams, user, role, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginRole) {
      setError("Invalid role selected")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await login(email, password, loginRole)

      if (result.success) {
        toast({
          title: "Login successful",
          description: `Welcome back!`,
        })
        router.push(`/dashboard/${loginRole}`)
      } else {
        setError(result.message || "Invalid credentials")
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.message || "Invalid credentials",
        })
      }
    } catch (err) {
      setError("An error occurred during login")
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = () => {
    switch (loginRole) {
      case "student":
        return <GraduationCap className="h-8 w-8 text-primary" />
      case "club":
        return <Users className="h-8 w-8 text-primary" />
      case "admin":
        return <Building2 className="h-8 w-8 text-primary" />
      default:
        return null
    }
  }

  const getRoleTitle = () => {
    switch (loginRole) {
      case "student":
        return "Student Login"
      case "club":
        return "Club Login"
      case "admin":
        return "Admin Login"
      default:
        return "Login"
    }
  }

  // Demo credentials based on role
  const getDemoCredentials = () => {
    switch (loginRole) {
      case "student":
        return { email: "rahul.s@rvce.edu.in", password: "password123" }
      case "club":
        return { email: "ieee@rvce.edu.in", password: "password123" }
      case "admin":
        return { email: "dean@rvce.edu.in", password: "password123" }
      default:
        return { email: "", password: "" }
    }
  }

  const fillDemoCredentials = () => {
    const credentials = getDemoCredentials()
    setEmail(credentials.email)
    setPassword(credentials.password)
  }

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden dark">
      <AnimatedGradientBackground />

      <Link href="/" className="absolute left-4 top-4 flex items-center text-sm text-white/80 hover:text-white z-10">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto z-10"
      >
        <Card className="backdrop-blur-sm bg-black/40 border-white/10 shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto rounded-full bg-primary/10 p-4 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            >
              {getRoleIcon()}
            </motion.div>
            <CardTitle className="text-2xl">{getRoleTitle()}</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 text-sm rounded-md bg-destructive/10 text-destructive"
                >
                  {error}
                </motion.div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/50 backdrop-blur-sm border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/50 backdrop-blur-sm border-white/10"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-2 text-sm bg-black/50 backdrop-blur-sm border-white/10"
                onClick={fillDemoCredentials}
              >
                Use Demo Credentials
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

