'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface EmailCaptureProps {
  label?: string
  placeholder?: string
  compact?: boolean
}

export default function EmailCapture({
  label = 'Stay in the loop',
  placeholder = 'your@email.com',
  compact = false,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email.')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setMessage("You're in. I'll send new pieces when they're ready.")
        setEmail('')
      } else {
        const data = await res.json()
        throw new Error(data.message || 'Something went wrong.')
      }
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="flex items-start gap-3 rounded-lg border p-4"
        style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--accent-muted)' }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 shrink-0"
          style={{ color: 'var(--accent)' }}
        >
          <polyline points="3 9 7 13 15 5" />
        </svg>
        <p className="text-sm" style={{ color: 'var(--fg)' }}>
          {message}
        </p>
      </div>
    )
  }

  return (
    <div>
      {!compact && (
        <p className="mb-3 text-sm font-medium" style={{ color: 'var(--fg)' }}>
          {label}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
        noValidate
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder={placeholder}
          disabled={status === 'loading'}
          className="input flex-1"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary shrink-0"
          style={status === 'loading' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 24" />
              </svg>
              Sending
            </span>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      {status === 'error' && message && (
        <p className="mt-2 text-xs" style={{ color: 'var(--accent)' }}>
          {message}
        </p>
      )}
    </div>
  )
}
