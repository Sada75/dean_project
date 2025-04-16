"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { GraduationCap, Users, Building2, School, BookOpen, CalendarDays } from "lucide-react"
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
        <div className="container flex h-20 items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/rvce-logo.png" 
              alt="RVCE Logo" 
              width={50} 
              height={50} 
              className="rounded-md"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold font-heading">R.V. College of Engineering</span>
              <span className="text-xs text-gray-400">Autonomous Institution affiliated to VTU, Belgaum</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 relative z-10">
        <section className="w-full py-12 md:py-24 lg:py-28">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white font-heading">
                  Activity Points Management Portal
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl mt-4">
                  Track, verify, and manage student activity points with ease.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="flex flex-col items-center justify-between backdrop-blur-sm bg-gradient-to-br from-black/60 to-black/40 border-white/10 shadow-xl hover:shadow-primary/20 hover:border-primary/50 transition-all overflow-hidden group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary/20 transition-colors">
                    <School className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-heading">Student Portal</CardTitle>
                  <CardDescription className="text-gray-300">Access your activity records</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center pb-6">
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary/70" />
                      <span>Track points progress</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary/70" />
                      <span>Register for events</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Link href="/login?role=student" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">Login as Student</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col items-center justify-between backdrop-blur-sm bg-gradient-to-br from-black/60 to-black/40 border-white/10 shadow-xl hover:shadow-primary/20 hover:border-primary/50 transition-all overflow-hidden group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-heading">Club Portal</CardTitle>
                  <CardDescription className="text-gray-300">Manage events and participants</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center pb-6">
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary/70" />
                      <span>Create event proposals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary/70" />
                      <span>Upload participation data</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Link href="/login?role=club" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">Login as Club</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col items-center justify-between backdrop-blur-sm bg-gradient-to-br from-black/60 to-black/40 border-white/10 shadow-xl hover:shadow-primary/20 hover:border-primary/50 transition-all overflow-hidden group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-heading">Admin Portal</CardTitle>
                  <CardDescription className="text-gray-300">Manage the entire system</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center pb-6">
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary/70" />
                      <span>Verify event submissions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary/70" />
                      <span>Manage student records</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Link href="/login?role=admin" className="w-full">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">Login as Admin</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 py-6 bg-black/50 backdrop-blur relative z-10">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} R.V. College of Engineering. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

