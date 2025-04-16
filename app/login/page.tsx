"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Users, Building2, ArrowLeft, Loader2, LockKeyhole, HeartHandshake } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { IntroAnimation } from "@/components/intro-animation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

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
  const [adminType, setAdminType] = useState<string | null>(null)

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
      // If admin login, use the adminType
      const actualRole = loginRole === "admin" && adminType ? adminType : loginRole
      
      const result = await login(email, password, actualRole)

      if (result.success) {
        toast({
          title: "Login successful",
          description: `Welcome back!`,
        })
        
        // Use the dashboardPath if provided, otherwise use the role
        const dashboardRoute = result.dashboardPath || actualRole
        router.push(`/dashboard/${dashboardRoute}`)
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
      case "counsellor":
        return <HeartHandshake className="h-8 w-8 text-primary" />
      default:
        return null
    }
  }

  const getRoleColor = () => {
    switch (loginRole) {
      case "student":
        return "from-blue-500 to-blue-600";
      case "club":
        return "from-purple-500 to-purple-600";
      case "admin":
        return "from-amber-500 to-amber-600";
      case "counsellor":
        return "from-green-500 to-green-600";
      default:
        return "from-primary to-primary/80";
    }
  }

  const getRoleTitle = () => {
    switch (loginRole) {
      case "student":
        return "Student Login"
      case "club":
        return "Club Login"
      case "admin":
        return adminType === "dean" ? "Dean Student Affairs Login" : "Admin Login"
      case "counsellor":
        return "Counsellor Login"
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
      case "counsellor":
        return { email: "counsellor@rvce.edu.in", password: "password123" }
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

      <Link href="/" className="absolute left-4 top-4 flex items-center text-sm text-white/80 hover:text-white z-10 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      
      <div className="absolute top-4 right-4 flex items-center z-10">
        <Image 
          src="/images/rvce-logo.png" 
          alt="RVCE Logo" 
          width={40} 
          height={40}
          className="rounded-md"
        />
        <div className="ml-2 flex flex-col">
          <span className="text-sm font-bold text-white/90">R.V. College of Engineering</span>
          <span className="text-xs text-white/60">Activity Points Portal</span>
        </div>
      </div>

      {!loginRole ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto z-10"
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-black/60 to-black/40 border-white/10 shadow-xl overflow-hidden">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-heading">Choose Login Type</CardTitle>
              <CardDescription className="text-foreground/70">Select your role to continue</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 p-6">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-32 p-6 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-all group"
                onClick={() => setLoginRole("student")}
              >
                <GraduationCap className="h-8 w-8 mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-white/90">Student</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-32 p-6 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-all group"
                onClick={() => setLoginRole("club")}
              >
                <Users className="h-8 w-8 mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-white/90">Club</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-32 p-6 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-all group"
                onClick={() => setLoginRole("admin")}
              >
                <Building2 className="h-8 w-8 mb-2 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-white/90">Admin</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-32 p-6 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-all group"
                onClick={() => setLoginRole("counsellor")}
              >
                <HeartHandshake className="h-8 w-8 mb-2 text-green-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-white/90">Counsellor</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : loginRole === "admin" && !adminType ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto z-10"
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-black/60 to-black/40 border-white/10 shadow-xl overflow-hidden">
            <div className={cn("h-1.5 w-full bg-gradient-to-r", getRoleColor())} />
            <CardHeader className="text-center pt-8">
              <Building2 className="mx-auto h-12 w-12 text-amber-500 mb-4" />
              <CardTitle className="text-2xl font-heading">Admin Login</CardTitle>
              <CardDescription className="text-foreground/70">Select your admin role to continue</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 p-6">
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-32 p-6 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-all group"
                onClick={() => setAdminType("dean")}
              >
                <Building2 className="h-8 w-8 mb-2 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-white/90">Dean Student Affairs</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col items-center justify-center h-32 p-6 backdrop-blur-sm border-white/10 hover:bg-white/5 transition-all group"
                onClick={() => setLoginRole("counsellor")}
              >
                <HeartHandshake className="h-8 w-8 mb-2 text-green-500 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-white/90">Counsellor</span>
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLoginRole(null)}
                className="text-sm text-white/60 hover:text-white group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to role selection
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto z-10"
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-black/60 to-black/40 border-white/10 shadow-xl overflow-hidden">
            <div className={cn("h-1.5 w-full bg-gradient-to-r", getRoleColor())} />
            <CardHeader className="text-center pt-8">
              <motion.div
                className={cn("mx-auto rounded-full p-5 mb-4 bg-primary/10 backdrop-blur-sm", 
                  loginRole === "student" ? "bg-blue-500/10" : 
                  loginRole === "club" ? "bg-purple-500/10" : 
                  loginRole === "counsellor" ? "bg-green-500/10" :
                  "bg-amber-500/10")}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              >
                {getRoleIcon()}
              </motion.div>
              <CardTitle className="text-2xl font-heading">{getRoleTitle()}</CardTitle>
              <CardDescription className="text-foreground/70 mt-1">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 text-sm rounded-md bg-destructive/15 text-destructive border border-destructive/20"
                  >
                    {error}
                  </motion.div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-black/30 backdrop-blur-sm border-white/10 pl-10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-4 h-4 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground/80">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-black/30 backdrop-blur-sm border-white/10 pl-10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <LockKeyhole className="w-4 h-4 text-primary/70" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3 pb-6">
                <Button
                  type="submit"
                  className={cn(
                    "w-full font-medium bg-gradient-to-r from-primary to-primary/80 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5",
                    loginRole === "student" ? "from-blue-500 to-blue-600" : 
                    loginRole === "club" ? "from-purple-500 to-purple-600" : 
                    loginRole === "counsellor" ? "from-green-500 to-green-600" :
                    "from-amber-500 to-amber-600"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={fillDemoCredentials} 
                  className="text-sm text-white/60 hover:text-white group"
                >
                  Use demo credentials
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setLoginRole(null)
                    setAdminType(null)
                  }}
                  className="text-sm text-white/60 hover:text-white group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to role selection
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

