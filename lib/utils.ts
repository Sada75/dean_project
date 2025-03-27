import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if the current path should show theme toggle
 * Only dashboard pages should show theme toggle
 */
export function shouldShowThemeToggle(pathname: string): boolean {
  // Show theme toggle only on dashboard pages
  return pathname?.startsWith('/dashboard') || false
}

/**
 * Performance monitoring utility
 * Use in development to track component render times and identify bottlenecks
 */
export const perf = {
  /**
   * Start timing a named operation
   */
  start: (label: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.time(`⚡ ${label}`)
    }
  },
  
  /**
   * End timing a named operation and log the result
   */
  end: (label: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.timeEnd(`⚡ ${label}`)
    }
  },
  
  /**
   * Log a performance message in development only
   */
  log: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔍 ${message}`, ...args)
    }
  }
}

/**
 * Debounce function to limit execution frequency
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

/**
 * Throttle function to limit execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  ms = 300
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastCall >= ms) {
      lastCall = now
      fn.apply(this, args)
    }
  }
}
