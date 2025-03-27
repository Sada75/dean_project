"use client"

import { Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useThemeVisibility } from "@/lib/theme-context"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { showThemeToggle } = useThemeVisibility()

  // Ensure proper hydration and avoid theme flicker
  useEffect(() => {
    setMounted(true)
  }, [])

  // Force dark theme if it's undefined (helps with hydration issues)
  useEffect(() => {
    if (mounted && (!theme || theme === 'light')) {
      setTheme('dark')
    }
  }, [mounted, theme, setTheme])

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
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
          <Moon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change dark mode style</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dim-dark")}>
          <Moon className="mr-2 h-4 w-4 opacity-70" />
          <span>Dim Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("pitch-dark")}>
          <Moon className="mr-2 h-4 w-4 opacity-90" />
          <span>Pitch Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

