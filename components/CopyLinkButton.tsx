'use client'

import { useState, useCallback } from 'react'

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-sm transition-colors hover:text-[color:var(--accent)]"
      style={{ color: 'var(--fg-muted)' }}
      aria-label="Copy link to this article"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 7 5.5 10.5 12 4" />
          </svg>
          <span style={{ color: 'var(--accent)' }}>Copied!</span>
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="8" height="8" rx="1.5" />
            <path d="M10 4V2.5A1.5 1.5 0 0 0 8.5 1H2.5A1.5 1.5 0 0 0 1 2.5v6A1.5 1.5 0 0 0 2.5 10H4" />
          </svg>
          Copy link
        </>
      )}
    </button>
  )
}
