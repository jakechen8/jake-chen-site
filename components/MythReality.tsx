'use client'

import { useEffect, useRef, useState } from 'react'

interface MythRealityProps {
  myth: string
  reality: string
  label?: string
}

export default function MythReality({
  myth,
  reality,
  label = 'Common take vs. reality',
}: MythRealityProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const [showStrike, setShowStrike] = useState(false)
  const [showReality, setShowReality] = useState(false)

  useEffect(() => {
    if (triggered) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            setTriggered(true)
            setShowStrike(true)
            // Delay reality reveal by 200ms after strikethrough starts
            setTimeout(() => setShowReality(true), 200)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.4 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [triggered])

  return (
    <div
      ref={containerRef}
      className="my-8 rounded-lg border p-6"
      style={{ borderColor: 'var(--border-strong)' }}
    >
      {/* Label */}
      <p
        className="font-mono text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--accent)' }}
      >
        {label}
      </p>

      {/* Myth section */}
      <div className="mt-6">
        <div
          className="relative"
          style={{
            opacity: showStrike ? 0.5 : 1,
            transition: 'opacity 400ms ease',
          }}
        >
          <p
            className="text-base font-normal"
            style={{
              color: 'var(--fg-muted)',
              textDecoration: showStrike ? 'line-through' : 'none',
              transition: 'text-decoration 600ms ease',
            }}
          >
            {myth}
          </p>
          {/* Strikethrough animation overlay */}
          {showStrike && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                background: 'var(--fg-muted)',
                transform: 'translateY(-50%)',
                animation: 'strikethrough 600ms ease forwards',
              }}
            />
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        className="my-5"
        style={{
          height: '1px',
          background: 'var(--border)',
        }}
      />

      {/* Reality section */}
      {showReality && (
        <div
          style={{
            opacity: showReality ? 1 : 0,
            transform: showReality ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 400ms ease, transform 400ms ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left accent bar */}
            <div
              style={{
                width: '3px',
                height: '100%',
                background: 'var(--accent)',
                flexShrink: 0,
                borderRadius: '1.5px',
              }}
            />
            <p
              className="text-base font-medium"
              style={{ color: 'var(--fg)' }}
            >
              {reality}
            </p>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes strikethrough {
          from {
            width: 0;
            left: 0;
          }
          to {
            width: 100%;
            left: 0;
          }
        }
      `}</style>
    </div>
  )
}
