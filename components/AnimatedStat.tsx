'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface AnimatedStatProps {
  value: string
  label: string
  context: string
  startFrom?: string
}

/**
 * Ease-out easing function for smooth deceleration.
 * @param t Progress from 0 to 1
 */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Extracts numeric value from a string like "98%", "3,016", "70km"
 */
function extractNumeric(str: string): { value: number; prefix: string; suffix: string } {
  const match = str.match(/^([^\d]*)(\d+[.,\d]*)([\D]*)$/)
  if (!match) {
    return { value: 0, prefix: '', suffix: '' }
  }
  const numStr = match[2].replace(/,/g, '')
  return {
    value: parseFloat(numStr),
    prefix: match[1],
    suffix: match[3],
  }
}

/**
 * Formats a number back to the original format with commas
 */
function formatNumber(num: number, suffix: string): string {
  // Check if original had commas (e.g., "3,016")
  if (suffix === '' && num >= 1000) {
    return num.toLocaleString()
  }
  // For percentages and other formats, just return the number
  return Math.round(num).toString()
}

export default function AnimatedStat({ value, label, context, startFrom }: AnimatedStatProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayValue, setDisplayValue] = useState(value)
  const [hasAnimated, setHasAnimated] = useState(false)

  const observer = useRef<IntersectionObserver | null>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true)

        if (startFrom) {
          // Animate the numeric value
          const fromData = extractNumeric(startFrom)
          const toData = extractNumeric(value)

          const startTime = Date.now()
          const duration = 1200 // 1200ms animation

          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easedProgress = easeOut(progress)

            const currentValue =
              fromData.value + (toData.value - fromData.value) * easedProgress

            const formatted = formatNumber(currentValue, toData.suffix)
            setDisplayValue(`${toData.prefix}${formatted}${toData.suffix}`)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              // Ensure final value is exact
              setDisplayValue(value)
            }
          }

          requestAnimationFrame(animate)
        } else {
          // Just fade in without counting
          setDisplayValue(value)
        }

        // Disconnect observer after animation starts
        if (observer.current) observer.current.disconnect()
      }
    },
    [startFrom, value, hasAnimated]
  )

  useEffect(() => {
    if (!containerRef.current) return

    observer.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    })

    observer.current.observe(containerRef.current)

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [handleIntersection])

  return (
    <div
      ref={containerRef}
      className="my-8 rounded-lg border p-6 text-center sm:p-8"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg-warm)',
        opacity: hasAnimated ? 1 : 0.8,
        transform: hasAnimated ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.6s ease-out',
      }}
    >
      {/* Main stat value */}
      <p
        className="font-display text-5xl font-normal sm:text-6xl"
        style={{
          color: 'var(--fg)',
          marginBottom: '0.5rem',
          lineHeight: 1.2,
        }}
      >
        {displayValue}
      </p>

      {/* Label */}
      <p
        className="font-mono text-xs font-medium uppercase tracking-widest"
        style={{
          color: 'var(--accent)',
          marginBottom: '1.5rem',
        }}
      >
        {label}
      </p>

      {/* Context explanation */}
      <p
        className="text-sm leading-relaxed"
        style={{
          color: 'var(--fg-muted)',
          maxWidth: '28rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {context}
      </p>
    </div>
  )
}
