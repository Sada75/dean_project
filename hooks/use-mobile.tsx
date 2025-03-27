"use client"

import { useState, useEffect, useCallback } from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect if the current viewport is mobile-sized
 * Optimized with debouncing to avoid excessive re-renders
 */
export function useIsMobile() {
  // Start with undefined to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  // Debounced check function
  const checkMobile = useCallback(() => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }, 100);
    };
  }, []);

  useEffect(() => {
    // Only run client-side to avoid hydration errors
    if (typeof window === 'undefined') return;
    
    const handleResize = checkMobile();
    
    // Initial check (without debounce)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Set up event listener with debounce
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [checkMobile]);

  // Return false during SSR, then the actual value client-side
  return isMobile ?? false;
}
