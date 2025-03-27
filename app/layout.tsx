import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeVisibilityProvider } from "@/lib/theme-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Optimization for font loading
})

export const metadata = {
  title: "RV College - Activity Points Management",
  description: "Track and verify student activity points",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <AuthProvider>
          <ThemeVisibilityProvider>
            <ThemeProvider>
              {children}
              <Toaster />
            </ThemeProvider>
          </ThemeVisibilityProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'