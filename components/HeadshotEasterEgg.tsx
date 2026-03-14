'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'

export default function HeadshotEasterEgg() {
  const [clicks, setClicks] = useState(0)
  const [wobble, setWobble] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleClick = useCallback(() => {
    setClicks((prev) => {
      const next = prev + 1
      if (next >= 5) {
        setWobble(true)
        // Reset after animation
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          setWobble(false)
          setClicks(0)
        }, 1500)
        return 0
      }
      return next
    })
  }, [])

  // Respect reduced motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      className="relative h-40 w-40 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2"
      style={{
        borderColor: wobble ? 'var(--accent)' : 'var(--border-strong)',
        transform: wobble && !prefersReduced ? 'rotate(360deg) scale(1.05)' : 'none',
        transition: wobble ? 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s' : 'border-color 0.3s',
      }}
      onClick={handleClick}
      role="img"
      aria-label="Jake Chen headshot — click 5 times for a surprise"
    >
      <Image
        src="/images/headshot1.jpg"
        alt="Jake Chen"
        fill
        className="object-cover"
        priority
        style={{
          filter: wobble ? 'hue-rotate(30deg) saturate(1.5)' : 'none',
          transition: 'filter 0.5s',
        }}
      />
      {wobble && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(180,83,9,0.2)' }}
        >
          <span className="text-2xl" aria-hidden="true">
            ✨
          </span>
        </div>
      )}
    </div>
  )
}
