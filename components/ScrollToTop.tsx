'use client'

import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
      style={{
        background: 'var(--bg)',
        borderColor: 'var(--border-strong)',
        color: 'var(--fg-muted)',
      }}
      aria-label="Scroll to top"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="8" y1="14" x2="8" y2="2" />
        <polyline points="3 7 8 2 13 7" />
      </svg>
    </button>
  )
}
