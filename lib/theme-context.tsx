"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { shouldShowThemeToggle } from "@/lib/utils"
import { useTheme } from "next-themes"

interface ThemeVisibilityContextType {
  showThemeToggle: boolean;
  isDashboard: boolean;
  setVibrantMode: () => void;
  setDarkMode: () => void;
}

const ThemeVisibilityContext = createContext<ThemeVisibilityContextType>({
  showThemeToggle: false,
  isDashboard: false,
  setVibrantMode: () => {},
  setDarkMode: () => {}
})

export const useThemeVisibility = () => useContext(ThemeVisibilityContext)

export function ThemeVisibilityProvider({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [showThemeToggle, setShowThemeToggle] = useState(false)
  const [isDashboard, setIsDashboard] = useState(false)
  
  useEffect(() => {
    // Update visibility based on current path
    const isPathDashboard = shouldShowThemeToggle(pathname)
    setShowThemeToggle(isPathDashboard)
    setIsDashboard(isPathDashboard)
    
    // If not in dashboard, force dark theme for all pages
    if (!isPathDashboard) {
      setTheme('dark')
    }
  }, [pathname, setTheme])
  
  // Helper functions to set theme
  const setVibrantMode = () => {
    setTheme('vibrant')
  }
  
  const setDarkMode = () => {
    setTheme('dark')
  }
  
  return (
    <ThemeVisibilityContext.Provider value={{ 
      showThemeToggle, 
      isDashboard, 
      setVibrantMode, 
      setDarkMode
    }}>
      {children}
    </ThemeVisibilityContext.Provider>
  )
} 