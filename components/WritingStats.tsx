'use client'

import { useEffect, useRef, useState } from 'react'

interface WritingStatsProps {
  totalPosts: number
  totalWords: number
  totalTags: number
}

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{value.toLocaleString()}</span>
}

export default function WritingStats({ totalPosts, totalWords, totalTags }: WritingStatsProps) {
  return (
    <div
      className="mb-10 grid grid-cols-3 gap-4 rounded-lg border p-4 sm:p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}
    >
      <div className="text-center">
        <p className="font-display text-2xl font-normal sm:text-3xl" style={{ color: 'var(--fg)' }}>
          <AnimatedNumber target={totalPosts} duration={800} />
        </p>
        <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>essays</p>
      </div>
      <div className="text-center">
        <p className="font-display text-2xl font-normal sm:text-3xl" style={{ color: 'var(--fg)' }}>
          <AnimatedNumber target={Math.round(totalWords / 1000)} duration={1000} />k
        </p>
        <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>words</p>
      </div>
      <div className="text-center">
        <p className="font-display text-2xl font-normal sm:text-3xl" style={{ color: 'var(--fg)' }}>
          <AnimatedNumber target={totalTags} duration={600} />
        </p>
        <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>topics</p>
      </div>
    </div>
  )
}
