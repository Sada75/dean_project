"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

// Add CSS variables for different dark theme variants
const darkThemeStyles = `
  :root[class~="dark"] {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 217.2 91.2% 59.8%;
  }

  :root[class~="dim-dark"] {
    --background: 240 10% 7%;
    --foreground: 0 0% 95%;
    --card: 240 10% 8%;
    --card-foreground: 0 0% 95%;
    --popover: 240 10% 8%;
    --popover-foreground: 0 0% 95%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 240 3.7% 19%;
    --secondary-foreground: 0 0% 95%;
    --muted: 240 3.7% 19%;
    --muted-foreground: 240 5% 67%;
    --accent: 240 3.7% 19%;
    --accent-foreground: 0 0% 95%;
    --destructive: 0 62.8% 35%;
    --destructive-foreground: 0 0% 95%;
    --border: 240 3.7% 19%;
    --input: 240 3.7% 19%;
    --ring: 217.2 91.2% 59.8%;
  }

  :root[class~="pitch-dark"] {
    --background: 0 0% 0%;
    --foreground: 0 0% 100%;
    --card: 0 0% 2%;
    --card-foreground: 0 0% 100%;
    --popover: 0 0% 2%;
    --popover-foreground: 0 0% 100%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 0 0% 12%;
    --secondary-foreground: 0 0% 100%;
    --muted: 0 0% 12%;
    --muted-foreground: 0 0% 67%;
    --accent: 0 0% 12%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 12%;
    --input: 0 0% 12%;
    --ring: 217.2 91.2% 59.8%;
  }
`

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Inject CSS variables for our dark theme variants
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style')
    styleEl.innerHTML = darkThemeStyles
    
    // Add style element to head
    document.head.appendChild(styleEl)
    
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])
  
  return (
    <NextThemesProvider 
      {...props} 
      attribute="class" 
      defaultTheme="dark" 
      forcedTheme={undefined}
      enableSystem={false}
      disableTransitionOnChange
      themes={["dark", "dim-dark", "pitch-dark"]}
    >
      {children}
    </NextThemesProvider>
  )
}

