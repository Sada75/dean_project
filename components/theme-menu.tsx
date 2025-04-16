"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeMenu() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="fixed right-4 bottom-4 z-50 flex gap-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full transition-all ${
            theme === "bright" ? "bg-orange-500/20 text-orange-600 border-orange-300/30" : "opacity-70 hover:opacity-100"
          }`}
          onClick={() => setTheme("bright")}
        >
          <Sun className="h-4 w-4 mr-2" />
          <span className="text-xs">Bright</span>
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.7 }}
      >
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full transition-all ${
            theme === "dark" ? "bg-primary/20 text-primary border-primary/30" : "opacity-70 hover:opacity-100"
          }`}
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4 mr-2" />
          <span className="text-xs">Dark</span>
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.9 }}
      >
        <Button
          variant="outline"
          size="sm"
          className={`rounded-full transition-all ${
            theme === "vibrant" ? "bg-indigo-500/20 text-indigo-500 border-indigo-300/30" : "opacity-70 hover:opacity-100"
          }`}
          onClick={() => setTheme("vibrant")}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          <span className="text-xs">Vibrant</span>
        </Button>
      </motion.div>
    </div>
  )
}
