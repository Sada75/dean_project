"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { GraduationCap, Users, Building2 } from "lucide-react"
import { AnimatedGradientBackground } from "@/components/animated-gradient-background"
import { IntroAnimation } from "@/components/intro-animation"
import { motion } from "framer-motion"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  // Force dark theme for this page
  useEffect(() => {
    document.documentElement.classList.add("dark")

    return () => {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />
  }

  return (
    <div className="flex min-h-screen flex-col relative dark">
      <AnimatedGradientBackground />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xl font-bold">RV College of Engineering</span>
          </div>
        </div>
      </header>
      <main className="flex-1 relative z-10">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Activity Points Management Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Track, verify, and manage student activity points with ease.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="flex flex-col items-center justify-between backdrop-blur-sm bg-black/40 border-white/10 shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto rounded-full bg-primary/10 p-4 mb-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Student</CardTitle>
                  <CardDescription>View your activity points and participation history</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <p className="text-sm text-gray-400">
                    Track your progress, view upcoming events, and manage your activity points.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/login?role=student" className="w-full">
                    <Button className="w-full">Login as Student</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col items-center justify-between backdrop-blur-sm bg-black/40 border-white/10 shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto rounded-full bg-primary/10 p-4 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Club</CardTitle>
                  <CardDescription>Create events and manage student participation</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <p className="text-sm text-gray-400">
                    Create and manage events, upload participation records, and track event status.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/login?role=club" className="w-full">
                    <Button className="w-full">Login as Club</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col items-center justify-between backdrop-blur-sm bg-black/40 border-white/10 shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="text-center">
                  <div className="mx-auto rounded-full bg-primary/10 p-4 mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Admin</CardTitle>
                  <CardDescription>Verify events and manage the entire system</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <p className="text-sm text-gray-400">
                    Verify event submissions, manage student records, and oversee the entire platform.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/login?role=admin" className="w-full">
                    <Button className="w-full">Login as Admin</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 py-6 md:py-0 bg-black/50 backdrop-blur relative z-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} RV College of Engineering. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

