'use client'

import { useState, useCallback } from 'react'

interface Choice {
  label: string
  result: string
  isRecommended?: boolean
}

interface Scenario {
  prompt: string
  choices: Choice[]
}

const scenarios: Record<string, Scenario> = {
  'coordination-analyses': {
    prompt:
      'Your team just got access to AI tools. Three people produce competing market analyses overnight. All three are credible. A decision needs to be made by Friday.',
    choices: [
      {
        label: 'Have each person present their analysis and debate it',
        result:
          "The meeting runs two hours. Everyone defends their methodology. No decision is made. A follow-up meeting is scheduled. This is the most common outcome — and it's exactly how AI makes organizations slower, not faster.",
        isRecommended: false,
      },
      {
        label: 'Assign one person as the decision owner before the analyses are produced',
        result:
          "The owner reviews all three, picks the strongest elements, makes the call, and documents the reasoning. Decision made in 30 minutes. The other analyses aren't wasted — they stress-tested the final direction.",
        isRecommended: true,
      },
      {
        label: 'Ask AI to synthesize all three analyses into one',
        result:
          "Now you have a fourth analysis. It's smoother but less opinionated. The real problem — who owns the decision — is still unresolved. AI can't fix unclear decision rights.",
      },
    ],
  },
  'openclaw-deploy': {
    prompt:
      "You're a CTO. Your engineering team wants to deploy an OpenClaw agent that can read Slack messages, access internal docs, and execute shell commands. How do you respond?",
    choices: [
      {
        label: 'Block it entirely — too risky',
        result:
          "Safe in the short term, but your competitors are already experimenting. You've eliminated risk but also eliminated learning. Six months from now, you'll be playing catch-up with zero institutional knowledge about agent security.",
      },
      {
        label: 'Let them experiment freely on a sandbox',
        result:
          "You'll learn fast, but without clear permission boundaries, someone will eventually connect it to production systems. Shadow AI is the enterprise equivalent of shadow IT — except it can take actions, not just store files.",
      },
      {
        label: 'Allow it with scoped permissions, read-only access first, and an audit trail',
        result:
          'This is the disciplined curiosity approach. You learn what agents can do, build institutional muscle around trust boundaries, and have data to justify expanding scope later. The teams that start here end up moving fastest.',
        isRecommended: true,
      },
    ],
  },
  'trust-automation': {
    prompt:
      'Your company wants to automate customer service escalations with AI. The VP of Engineering proposes two approaches.',
    choices: [
      {
        label: 'Deploy full automation now, fix issues as they come up',
        result:
          "You launch fast. Week one looks great. Week three, an edge case causes a VIP customer to receive an incorrect resolution. No audit trail to understand what happened. Trust is broken — internally and externally. The project gets rolled back to human-in-the-loop for everything.",
      },
      {
        label: 'Start with low-risk cases only, add observability, expand with proof',
        result:
          "Slower start. But after 60 days you have data: 94% correct resolution rate, clear documentation of the 6% that escalated, and stakeholder confidence to expand. By month four, you're handling 3x the volume your competitor can — because you earned the right to scale.",
        isRecommended: true,
      },
    ],
  },
}

interface ScenarioChoiceProps {
  id: string
}

export default function ScenarioChoice({ id }: ScenarioChoiceProps) {
  const scenario = scenarios[id]
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = useCallback(
    (idx: number) => {
      if (selected !== null) return
      setSelected(idx)
    },
    [selected]
  )

  if (!scenario) {
    return null
  }

  const { prompt, choices } = scenario

  return (
    <div
      className="my-8 rounded-lg border p-6 sm:p-8"
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-warm)' }}
    >
      {/* Header label */}
      <p
        className="font-mono text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--accent)' }}
      >
        Scenario
      </p>

      {/* Prompt */}
      <p
        className="mt-4 font-display text-lg font-normal italic"
        style={{ color: 'var(--fg)' }}
      >
        {prompt}
      </p>

      {/* Choice buttons */}
      <div className="mt-6 space-y-2">
        {choices.map((choice, i) => {
          let borderColor = 'var(--border-strong)'
          let bg = 'transparent'

          if (selected !== null) {
            if (i === selected) {
              borderColor = 'var(--accent)'
              bg = 'var(--accent-light)'
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className="w-full rounded-md border px-4 py-3 text-left text-sm transition-all"
              style={{
                borderColor,
                background: bg,
                color: 'var(--fg)',
                cursor: selected !== null ? 'default' : 'pointer',
                opacity: selected !== null && i !== selected ? 0.5 : 1,
              }}
            >
              <div className="flex items-center justify-between">
                <span>{choice.label}</span>
                {selected === i && choice.isRecommended && (
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    ✓
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Result reveal */}
      {selected !== null && (
        <div
          className="mt-6 rounded-md border p-4"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg)',
            opacity: 0,
            transform: 'translateY(8px)',
            animation: 'scenarioFadeIn 400ms ease forwards',
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {choices[selected].result}
          </p>
          {choices[selected].isRecommended && (
            <p
              className="mt-3 font-mono text-xs font-medium uppercase tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              Recommended path
            </p>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes scenarioFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
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
