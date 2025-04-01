"use client"

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function AnimatedGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Store canvas dimensions to use in the Particle class
    let canvasWidth = window.innerWidth
    let canvasHeight = window.innerHeight

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvasWidth = window.innerWidth
      canvasHeight = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.size = Math.random() * 4 + 0.5
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.opacity = Math.random() * 0.5 + 0.1
        
        // Create various shades of blue, purple and teal for particles
        const colors = [
          'rgba(66, 135, 245, 0.8)',  // blue
          'rgba(138, 43, 226, 0.6)',  // purple
          'rgba(0, 230, 218, 0.7)',   // teal
          'rgba(255, 255, 255, 0.5)', // white
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x < 0) this.x = canvasWidth
        if (this.x > canvasWidth) this.x = 0
        if (this.y < 0) this.y = canvasHeight
        if (this.y > canvasHeight) this.y = 0
      }

      draw() {
        if (!ctx) return
        
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        )
        gradient.addColorStop(0, this.color)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particleCount = Math.min(window.innerWidth * 0.1, 150) // Responsive count
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      if (!ctx || !canvas) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      <motion.div 
        className="fixed inset-0 z-0 bg-gradient-to-br from-black via-blue-950 to-black opacity-95"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(8,17,47,1) 50%, rgba(0,0,0,1) 100%)',
            'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(20,15,60,1) 50%, rgba(0,0,0,1) 100%)',
            'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(8,17,47,1) 50%, rgba(0,0,0,1) 100%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </>
  )
}

