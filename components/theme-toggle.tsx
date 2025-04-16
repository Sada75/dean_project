"use client"

import { Moon, Sun, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useThemeVisibility } from "@/lib/theme-context"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { showThemeToggle } = useThemeVisibility()

  // Ensure proper hydration and avoid theme flicker
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything if we shouldn't show the theme toggle on this page
  if (!showThemeToggle) {
    return null
  }

  // Show a loading state before mounting to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
        <span className="sr-only">Loading theme</span>
        <div className="h-[1.2rem] w-[1.2rem] opacity-50" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-9 w-9 rounded-full relative overflow-hidden border-primary/20"
        >
          <motion.div
            key={theme}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
            ) : theme === "vibrant" ? (
              <Sparkles className="h-[1.2rem] w-[1.2rem] text-indigo-400" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
          </motion.div>
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-primary/20 bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-sm">
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-primary/10"
        >
          <div className="rounded-full bg-primary/10 p-1">
            <Moon className="h-4 w-4" />
          </div>
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("vibrant")} 
          className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-primary/10"
        >
          <div className="rounded-full bg-indigo-500/10 p-1">
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <span>Vibrant</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

