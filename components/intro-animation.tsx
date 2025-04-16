"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showLogo, setShowLogo] = useState(true)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // Show text after logo appears
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 600)

    // Complete animation after some time
    const completeTimer = setTimeout(() => {
      setShowLogo(false)
      setTimeout(onComplete, 500) // Wait for exit animation to complete
    }, 2500)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {showLogo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 rounded-xl bg-black/40 border border-white/10 p-8 shadow-lg backdrop-blur-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="relative h-20 w-20"
            >
              <Image 
                src="/images/rvce-logo.png" 
                alt="RVCE Logo" 
                fill
                className="object-contain"
              />
            </motion.div>

            <AnimatePresence>
              {showText && (
                <motion.div
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h1
                    className="text-center text-2xl font-bold text-white"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    RV College of Engineering
                  </motion.h1>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

