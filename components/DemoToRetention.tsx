'use client'

import { useState, useCallback } from 'react'

interface MetricPoint {
  day: number
  excitement: number
  supportTickets: number
  churn: number
  dailyActive: number
}

const data: MetricPoint[] = [
  { day: 0, excitement: 95, supportTickets: 5, churn: 0, dailyActive: 100 },
  { day: 7, excitement: 88, supportTickets: 12, churn: 2, dailyActive: 92 },
  { day: 14, excitement: 72, supportTickets: 28, churn: 8, dailyActive: 78 },
  { day: 21, excitement: 55, supportTickets: 45, churn: 18, dailyActive: 62 },
  { day: 30, excitement: 40, supportTickets: 55, churn: 30, dailyActive: 48 },
  { day: 45, excitement: 28, supportTickets: 60, churn: 42, dailyActive: 35 },
  { day: 60, excitement: 20, supportTickets: 52, churn: 55, dailyActive: 25 },
  { day: 75, excitement: 15, supportTickets: 42, churn: 62, dailyActive: 18 },
  { day: 90, excitement: 12, supportTickets: 35, churn: 68, dailyActive: 14 },
]

function interpolate(points: MetricPoint[], dayTarget: number): MetricPoint {
  if (dayTarget <= 0) return points[0]
  if (dayTarget >= 90) return points[points.length - 1]

  let i = 0
  while (i < points.length - 1 && points[i + 1].day <= dayTarget) i++
  if (i >= points.length - 1) return points[points.length - 1]

  const p0 = points[i]
  const p1 = points[i + 1]
  const t = (dayTarget - p0.day) / (p1.day - p0.day)

  return {
    day: dayTarget,
    excitement: Math.round(p0.excitement + (p1.excitement - p0.excitement) * t),
    supportTickets: Math.round(p0.supportTickets + (p1.supportTickets - p0.supportTickets) * t),
    churn: Math.round(p0.churn + (p1.churn - p0.churn) * t),
    dailyActive: Math.round(p0.dailyActive + (p1.dailyActive - p0.dailyActive) * t),
  }
}

function getPhaseLabel(day: number): string {
  if (day <= 7) return 'The Wow Phase'
  if (day <= 21) return 'Reality Sets In'
  if (day <= 45) return 'The Valley of Disappointment'
  if (day <= 70) return 'The Grind'
  return 'What Survived'
}

function getPhaseDescription(day: number): string {
  if (day <= 7) return 'Everyone loves the demo. Twitter threads. Internal Slack buzz. "This changes everything."'
  if (day <= 21) return 'Users hit real workflows. Edge cases appear. "Wait, it can\'t do that?"'
  if (day <= 45) return 'Support tickets peak. Power users leave. The gap between demo and daily use becomes obvious.'
  if (day <= 70) return 'Only committed users remain. The product either earns trust through reliability — or it doesn\'t.'
  return 'What\'s left isn\'t hype. It\'s the users who found real, repeated value. This is your actual product-market fit.'
}

export default function DemoToRetention() {
  const [day, setDay] = useState(0)
  const current = interpolate(data, day)
  const phase = getPhaseLabel(day)
  const desc = getPhaseDescription(day)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDay(Number(e.target.value))
  }, [])

  const metrics = [
    { label: 'Excitement', value: current.excitement, color: '#D97706', icon: '✦' },
    { label: 'Support Tickets', value: current.supportTickets, color: '#EF4444', icon: '▲' },
    { label: 'Churn Rate', value: current.churn, color: '#DC2626', icon: '↓' },
    { label: 'Daily Active %', value: current.dailyActive, color: '#22C55E', icon: '●' },
  ]

  return (
    <section
      role="region"
      aria-label="Demo to Retention visualization — drag the slider to see how AI product metrics change over 90 days"
      className="my-10 rounded-lg border p-5 sm:p-8"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
    >
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
          Interactive
        </p>
        <h3 className="font-display text-lg font-normal tracking-tight" style={{ color: 'var(--fg)' }}>
          The 90-Day Reality Check
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'var(--fg-subtle)' }}>
          Drag the slider to watch what happens after Demo Day.
        </p>
      </div>

      {/* Slider */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium" style={{ color: 'var(--fg-subtle)' }}>
          <span>Demo Day</span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            Day {day}
          </span>
          <span>Day 90</span>
        </div>
        <input
          type="range"
          min="0"
          max="90"
          value={day}
          onChange={handleChange}
          aria-label={`Day ${day} of 90`}
          className="w-full accent-amber-600"
          style={{ accentColor: 'var(--accent)' }}
        />
      </div>

      {/* Phase label */}
      <div
        className="mb-6 rounded-md border px-4 py-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }} aria-live="polite">
          {phase}
        </p>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
          {desc}
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="group" aria-label="Metrics">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-md border px-3 py-3 text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--fg-subtle)' }}>
              {m.label}
            </p>
            <p
              className="font-mono text-2xl font-semibold tabular-nums"
              style={{ color: m.color }}
              aria-live="polite"
            >
              {m.value}
              <span className="text-sm">%</span>
            </p>
            {/* Mini bar */}
            <div
              className="mx-auto mt-2 h-1.5 rounded-full"
              style={{ background: 'var(--border)', width: '100%' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${m.value}%`, background: m.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
