import type React from "react"
import "@/app/globals.css"
import { Inter, Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeVisibilityProvider } from "@/lib/theme-context"
import { Toaster } from "@/components/ui/toaster"

// Primary font for body content
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

// Secondary font for headings
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: "RVCE - Activity Points Management",
  description: "Track and manage student activity points for R.V. College of Engineering",
  generator: 'Next.js',
  icons: {
    icon: '/rvce-logo-new.png',
    apple: '/rvce-logo-new.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background font-sans">
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