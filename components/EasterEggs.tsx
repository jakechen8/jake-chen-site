'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

function Confetti() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string; angle: number; speed: number }[]
  >([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const colors = ['#B45309', '#D97706', '#F59E0B', '#FCD34D', '#FBBF24']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      speed: 2 + Math.random() * 4,
    }))
    setParticles(newParticles)

    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: '8px',
            height: '8px',
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            backgroundColor: p.color,
            animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
            transform: `rotate(${p.angle}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function EasterEggs() {
  const [showConfetti, setShowConfetti] = useState(false)
  const inputRef = useRef<string[]>([])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    inputRef.current.push(e.key)
    if (inputRef.current.length > KONAMI.length) {
      inputRef.current = inputRef.current.slice(-KONAMI.length)
    }
    if (inputRef.current.join(',') === KONAMI.join(',')) {
      setShowConfetti(true)
      inputRef.current = []
      setTimeout(() => setShowConfetti(false), 4000)
    }
  }, [])

  useEffect(() => {
    // Console message
    console.log(
      '%c👋 Hey, you\'re looking at the source? Nice.',
      'font-size: 14px; font-weight: bold; color: #D97706;'
    )
    console.log(
      '%cI built this site from scratch — Next.js, TypeScript, Tailwind, zero templates.\nIf you want to talk code or strategy: hello@jake-chen.com',
      'font-size: 12px; color: #A1A1AA;'
    )

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Check prefers-reduced-motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (showConfetti && !prefersReduced) return <Confetti />
  return null
}
