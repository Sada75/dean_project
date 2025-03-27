"use client"

import { useEffect, useRef, useMemo } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface AnimatedGradientBackgroundProps {
  className?: string
}

export function AnimatedGradientBackground({ className }: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const lastRenderTimeRef = useRef<number>(0)
  const FPS = 30 // Limit animation to 30 FPS for better performance

  // Memoize theme colors to avoid recalculations
  const themeColors = useMemo(() => {
    const isDark = resolvedTheme === "dark"
    return {
      isDark,
      baseColors: isDark 
        ? ["rgba(30, 30, 30, 1)", "rgba(15, 15, 15, 1)", "rgba(0, 0, 0, 1)"]
        : ["rgba(255, 255, 255, 1)", "rgba(240, 240, 245, 1)", "rgba(230, 230, 240, 1)"],
      highlightColors: isDark
        ? ["rgba(50, 50, 50, 0.3)", "rgba(40, 40, 40, 0.1)", "rgba(0, 0, 0, 0)"]
        : ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.2)", "rgba(240, 240, 245, 0)"]
    }
  }, [resolvedTheme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false }) // Optimize by disabling alpha
    if (!ctx) return

    // Set canvas dimensions only once
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      // Use CSS pixels for dimensions and scale internally
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    // Handle resize with throttling
    let resizeTimeout: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(setCanvasDimensions, 100)
    }

    window.addEventListener("resize", handleResize)
    setCanvasDimensions()

    // Animation function with FPS limiting
    const animate = (timestamp: number) => {
      // Throttle to target FPS
      if (timestamp - lastRenderTimeRef.current < 1000 / FPS) {
        requestAnimationFrame(animate)
        return
      }
      
      lastRenderTimeRef.current = timestamp
      
      // Get canvas dimensions in CSS pixels
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Create a radial gradient - simplified for performance
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.5, // Reduced size for better performance
      )

      // Apply base gradient colors
      themeColors.baseColors.forEach((color, index) => {
        gradient.addColorStop(index/2, color)
      })

      // Fill with base gradient
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add subtle highlight with reduced complexity
      const time = timestamp * 0.0005 // Slower animation
      const x1 = Math.sin(time * 0.3) * width * 0.3 + width * 0.5
      const y1 = Math.cos(time * 0.2) * height * 0.3 + height * 0.5

      const highlight = ctx.createRadialGradient(
        x1, y1, 0, 
        x1, y1, Math.min(width, height) * 0.3
      )

      themeColors.highlightColors.forEach((color, index) => {
        highlight.addColorStop(index/2, color)
      })

      // Add highlight - with reduced opacity for better performance
      ctx.globalAlpha = 0.8
      ctx.fillStyle = highlight
      ctx.fillRect(0, 0, width, height)
      ctx.globalAlpha = 1.0

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
      cancelAnimationFrame(animationId)
    }
  }, [themeColors])

  return <canvas ref={canvasRef} className={cn("fixed inset-0 -z-10 h-full w-full", className)} />
}

