'use client'

import { useState, useCallback } from 'react'

interface System {
  name: string
  verificationGap: number
  stakes: number
  emoji: string
  insight: string
}

const systems: System[] = [
  {
    name: 'Google Maps',
    verificationGap: 15,
    stakes: 20,
    emoji: '🗺️',
    insight: 'Low stakes, easy to verify. You can see if the route is wrong in real-time.',
  },
  {
    name: 'AI Hiring Tool',
    verificationGap: 85,
    stakes: 90,
    emoji: '👔',
    insight: 'High stakes, almost impossible to verify. You can\'t easily tell if a good candidate was filtered out.',
  },
  {
    name: 'Fraud Detector',
    verificationGap: 60,
    stakes: 75,
    emoji: '🔍',
    insight: 'High stakes, partially verifiable. False positives are visible, but false negatives hide.',
  },
  {
    name: 'Code Copilot',
    verificationGap: 30,
    stakes: 40,
    emoji: '💻',
    insight: 'Medium stakes, fairly verifiable. You can read the code and test it — but subtle bugs slip through.',
  },
  {
    name: 'Medical Diagnosis AI',
    verificationGap: 70,
    stakes: 95,
    emoji: '🏥',
    insight: 'Extremely high stakes, hard to verify without expertise. Second opinions become critical.',
  },
]

export default function TrustMatrix() {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSystemClick = useCallback((name: string) => {
    setSelected(name)
  }, [])

  const selectedSystem = selected ? systems.find((s) => s.name === selected) : null

  return (
    <div
      className="my-8 rounded-lg border p-6 sm:p-8"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
      role="region"
      aria-label="Interactive trust matrix — click systems to see where they fall on the stakes vs verification gap spectrum"
    >
      {/* Header */}
      <p
        className="font-mono text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--accent)' }}
      >
        Trust Matrix
      </p>

      {/* Matrix Container */}
      <div className="mt-6">
        {/* Axis label: Stakes (above matrix, left-aligned) */}
        <p
          className="mb-2 text-xs font-medium"
          style={{ color: 'var(--fg-subtle)' }}
        >
          ↑ Stakes
        </p>

        <div
          className="relative mx-auto"
          style={{
            aspectRatio: '1',
            maxWidth: '400px',
            width: '100%',
            background: 'var(--bg)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
          }}
        >
          {/* Quadrant dividing lines */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'var(--border)',
              transform: 'translateY(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '1px',
              background: 'var(--border)',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Quadrant labels */}
          <div
            style={{
              position: 'absolute',
              bottom: '50%',
              left: '10%',
              right: '50%',
              top: '10%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              padding: '12px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--fg-subtle)',
            }}
          >
            Gut check territory
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '50%',
              right: '10%',
              left: '50%',
              top: '10%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              padding: '12px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--fg-subtle)',
            }}
          >
            Danger zone
          </div>

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '50%',
              bottom: '10%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              padding: '12px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--fg-subtle)',
            }}
          >
            Safe bet
          </div>

          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '10%',
              left: '50%',
              bottom: '10%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              padding: '12px',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--fg-subtle)',
            }}
          >
            Trust but verify
          </div>

          {/* System dots */}
          {systems.map((system) => {
            const isSelected = selected === system.name
            const xPercent = system.verificationGap
            const yPercent = 100 - system.stakes

            return (
              <button
                key={system.name}
                onClick={() => handleSystemClick(system.name)}
                aria-label={`${system.name}: Verification gap ${system.verificationGap}%, Stakes ${system.stakes}%`}
                aria-pressed={isSelected}
                style={{
                  position: 'absolute',
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  width: isSelected ? '20px' : '12px',
                  height: isSelected ? '20px' : '12px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: isSelected
                    ? '0 0 12px rgba(180, 83, 9, 0.6), 0 0 24px rgba(180, 83, 9, 0.2)'
                    : '0 0 8px rgba(180, 83, 9, 0.4)',
                  transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 10 : 5,
                  border: 'none',
                  padding: 0,
                }}
              />
            )
          })}
        </div>

        {/* Axis label: Verification Gap (below matrix, right-aligned) */}
        <p
          className="mt-2 text-right text-xs font-medium"
          style={{ color: 'var(--fg-subtle)', maxWidth: '400px', margin: '8px auto 0' }}
        >
          Verification Gap →
        </p>

        {/* System buttons - below matrix */}
        <div
          style={{
            marginTop: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
          }}
          role="group"
          aria-label="Select a system to see its trust profile"
        >
          {systems.map((system) => {
            const isActive = selected === system.name

            return (
              <button
                key={system.name}
                onClick={() => handleSystemClick(system.name)}
                aria-pressed={isActive}
                aria-label={`${system.name}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--fg)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
              >
                <span aria-hidden="true">{system.emoji}</span>
                <span>{system.name}</span>
              </button>
            )
          })}
        </div>

        {/* Insight text */}
        {selectedSystem && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '6px',
              background: 'var(--bg)',
              borderLeft: '3px solid var(--accent)',
              animation: 'fadeIn 300ms ease-out',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--fg-muted)',
                margin: 0,
              }}
            >
              {selectedSystem.insight}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
