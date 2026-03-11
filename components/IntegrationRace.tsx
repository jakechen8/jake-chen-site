'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export default function IntegrationRace() {
  const [raceStarted, setRaceStarted] = useState(false)
  const [raceComplete, setRaceComplete] = useState(false)
  const [bestModelProgress, setBestModelProgress] = useState(0)
  const [bestIntegrationProgress, setBestIntegrationProgress] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const RACE_DURATION = 3000 // 3 seconds in ms

  // Easing functions
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
  const easeIn = (t: number) => t * t * t

  const runRace = useCallback(() => {
    if (raceStarted) return

    setRaceStarted(true)
    setRaceComplete(false)
    setBestModelProgress(0)
    setBestIntegrationProgress(0)
    startTimeRef.current = Date.now()

    const animate = () => {
      if (!startTimeRef.current) return

      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / RACE_DURATION, 1)

      // Best Model: quick ramp to 60% in first 1.5s (ease-out), then crawls to 65%
      let modelProgress
      if (progress < 0.5) {
        // First 1.5s: ramp to 60% with easeOut
        modelProgress = easeOut(progress * 2) * 60
      } else {
        // Remaining 1.5s: crawl from 60% to 65%
        const crawlProgress = (progress - 0.5) * 2
        modelProgress = 60 + crawlProgress * 5
      }

      // Best Integrations: slow start (ease-in) to 30% at 1.5s, then accelerates to 90%
      let integrationProgress
      if (progress < 0.5) {
        // First 1.5s: slow start with easeIn to 30%
        integrationProgress = easeIn(progress * 2) * 30
      } else {
        // Remaining 1.5s: accelerate with easeOut to 90%
        const accelerateProgress = (progress - 0.5) * 2
        integrationProgress = 30 + easeOut(accelerateProgress) * 60
      }

      setBestModelProgress(modelProgress)
      setBestIntegrationProgress(integrationProgress)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Race complete
        setBestModelProgress(65)
        setBestIntegrationProgress(90)
        setRaceComplete(true)
        setRaceStarted(false)
        startTimeRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [raceStarted])

  const handleRunAgain = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setRaceComplete(false)
    runRace()
  }, [runRace])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div
      className="my-8 rounded-lg border p-6 sm:p-8"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
    >
      {/* Header */}
      <p
        className="font-mono text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--accent)' }}
      >
        Market Race
      </p>

      {/* Race Container */}
      <div className="mt-6">
        {/* Best Model Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', justifyContent: 'space-between' }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--fg-muted)',
                margin: 0,
              }}
            >
              Best Model
            </p>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--fg-subtle)',
                margin: 0,
              }}
            >
              {Math.round(bestModelProgress)}%
            </p>
          </div>

          <div
            style={{
              width: '100%',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${bestModelProgress}%`,
                background: 'var(--fg-subtle)',
                transition: raceStarted ? 'none' : 'width 200ms ease-out',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>

        {/* Best Integrations Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', justifyContent: 'space-between' }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--fg)',
                margin: 0,
              }}
            >
              Best Integrations
            </p>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent)',
                margin: 0,
              }}
            >
              {Math.round(bestIntegrationProgress)}%
            </p>
          </div>

          <div
            style={{
              width: '100%',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${bestIntegrationProgress}%`,
                background: 'var(--accent)',
                boxShadow: bestIntegrationProgress > 0 ? '0 0 12px rgba(var(--accent-rgb), 0.5)' : 'none',
                transition: raceStarted ? 'none' : 'width 200ms ease-out',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>

        {/* Winner text - fades in after race completes */}
        {raceComplete && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '16px',
              marginBottom: '20px',
              animation: 'fadeInScale 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--accent)',
                margin: 0,
              }}
            >
              Winner: Best Integrations
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ textAlign: 'center' }}>
          {!raceStarted && !raceComplete && (
            <button onClick={runRace} className="btn-primary">
              Run the race
            </button>
          )}

          {raceComplete && (
            <button onClick={handleRunAgain} className="btn-primary">
              Run again
            </button>
          )}
        </div>

        {/* Takeaway message */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              fontStyle: 'italic',
              color: 'var(--fg-muted)',
              margin: 0,
            }}
          >
            The best model doesn't win. The most connected one does.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
