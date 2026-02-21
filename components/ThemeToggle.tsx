'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        style={{ color: 'var(--fg-muted)' }}
      >
        <span className="h-4 w-4 rounded-full bg-current opacity-20" />
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-8 w-8 items-center justify-center rounded-md transition-all hover:bg-[color:var(--border)]"
      style={{ color: 'var(--fg-muted)' }}
    >
      {isDark ? (
        /* Sun */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="3" />
          <line x1="8" y1="1" x2="8" y2="2.5" />
          <line x1="8" y1="13.5" x2="8" y2="15" />
          <line x1="1" y1="8" x2="2.5" y2="8" />
          <line x1="13.5" y1="8" x2="15" y2="8" />
          <line x1="3.05" y1="3.05" x2="4.12" y2="4.12" />
          <line x1="11.88" y1="11.88" x2="12.95" y2="12.95" />
          <line x1="12.95" y1="3.05" x2="11.88" y2="4.12" />
          <line x1="4.12" y1="11.88" x2="3.05" y2="12.95" />
        </svg>
      ) : (
        /* Moon */
        <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
          <path d="M7.5 1a6.5 6.5 0 1 0 6.5 6.5A6.51 6.51 0 0 0 7.5 1zm0 11.5a5 5 0 1 1 3.54-8.54A5.47 5.47 0 0 0 9.5 7.5a5.47 5.47 0 0 0 3.42 5.07A4.98 4.98 0 0 1 7.5 12.5z" />
        </svg>
      )}
    </button>
  )
}
