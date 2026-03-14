'use client'

import { useEffect, useRef, useState } from 'react'

interface ParallaxHeroProps {
  children: React.ReactNode
}

export default function ParallaxHero({ children }: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (prefersReduced) return

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            // Only parallax when visible
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              setOffset(window.scrollY * 0.15)
            }
          }
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [prefersReduced])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <div
        style={{
          transform: prefersReduced ? 'none' : `translateY(${offset}px)`,
          willChange: prefersReduced ? 'auto' : 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
