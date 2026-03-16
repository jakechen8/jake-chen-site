'use client'

import { useState, useEffect, useCallback } from 'react'

interface Company {
  name: string
  ticker: string
  basePrice: number
  volatility: number
}

interface Headline {
  day: number
  ticker: string
  text: string
  effect: number // multiplier applied to that company
}

const companies: Company[] = [
  { name: 'LatentLabs', ticker: 'LTNT', basePrice: 42, volatility: 0.08 },
  { name: 'HalluciCorp', ticker: 'HLCN', basePrice: 87, volatility: 0.12 },
  { name: 'OverfitAI', ticker: 'OFIT', basePrice: 156, volatility: 0.10 },
  { name: 'ContextWindow', ticker: 'CNTX', basePrice: 63, volatility: 0.07 },
  { name: 'GradientDescent Capital', ticker: 'GRAD', basePrice: 210, volatility: 0.06 },
]

const headlines: Headline[] = [
  { day: 3, ticker: 'HLCN', text: 'HalluciCorp\'s chatbot tells user to eat rocks. Stock tumbles.', effect: -0.15 },
  { day: 5, ticker: 'LTNT', text: 'LatentLabs raises $2B Series D at record valuation.', effect: 0.20 },
  { day: 8, ticker: 'OFIT', text: 'OverfitAI achieves 99.9% accuracy on training data. Test set... less so.', effect: -0.12 },
  { day: 10, ticker: 'CNTX', text: 'ContextWindow extends context to 10M tokens. Analysts impressed.', effect: 0.18 },
  { day: 13, ticker: 'GRAD', text: 'GradientDescent Capital lands Department of Defense contract.', effect: 0.15 },
  { day: 15, ticker: 'HLCN', text: 'HalluciCorp pivots to "trustworthy AI." Nobody believes them.', effect: 0.08 },
  { day: 18, ticker: 'LTNT', text: 'LatentLabs CEO tweets "AGI is 6 months away." Again.', effect: -0.10 },
  { day: 20, ticker: 'OFIT', text: 'OverfitAI open-sources their model. Community loves it.', effect: 0.25 },
  { day: 23, ticker: 'CNTX', text: 'ContextWindow acquires struggling NLP startup for pennies.', effect: 0.10 },
  { day: 25, ticker: 'GRAD', text: 'Leaked memo: GradientDescent running low on GPUs.', effect: -0.18 },
  { day: 27, ticker: 'HLCN', text: 'HalluciCorp\'s new model actually works. Market stunned.', effect: 0.30 },
]

const TOTAL_DAYS = 30
const STORAGE_KEY = 'tokentrader-stats'

function loadStats() {
  if (typeof window === 'undefined') return { bestProfit: -Infinity, gamesPlayed: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { bestProfit: -Infinity, gamesPlayed: 0 }
  } catch { return { bestProfit: -Infinity, gamesPlayed: 0 } }
}

function saveStats(stats: { bestProfit: number; gamesPlayed: number }) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)) } catch {}
}

function generatePrices(seed: number): number[][] {
  // Generate all price data upfront
  let rng = seed
  const nextRng = () => {
    rng = (rng * 1664525 + 1013904223) & 0x7fffffff
    return (rng / 0x7fffffff)
  }

  const prices: number[][] = companies.map((c) => [c.basePrice])

  for (let day = 1; day <= TOTAL_DAYS; day++) {
    companies.forEach((c, ci) => {
      const prev = prices[ci][day - 1]
      const headlineEffect = headlines.find((h) => h.day === day && h.ticker === c.ticker)
      const drift = headlineEffect ? headlineEffect.effect : (nextRng() - 0.48) * c.volatility
      const newPrice = Math.max(1, prev * (1 + drift))
      prices[ci].push(Math.round(newPrice * 100) / 100)
    })
  }

  return prices
}

export default function TokenTrader() {
  const [day, setDay] = useState(0)
  const [cash, setCash] = useState(10000)
  const [holdings, setHoldings] = useState<number[]>(companies.map(() => 0))
  const [prices, setPrices] = useState<number[][]>([])
  const [currentHeadline, setCurrentHeadline] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [stats, setStats] = useState({ bestProfit: -Infinity, gamesPlayed: 0 })
  const [buyAmount, setBuyAmount] = useState<number[]>(companies.map(() => 1))

  useEffect(() => {
    setStats(loadStats())
    setPrices(generatePrices(Date.now()))
  }, [])

  const portfolioValue = prices.length > 0
    ? holdings.reduce((total, qty, i) => total + qty * (prices[i]?.[day] || 0), 0) + cash
    : 10000

  const advanceDay = () => {
    const nextDay = day + 1
    if (nextDay >= TOTAL_DAYS) {
      const finalValue = holdings.reduce((total, qty, i) => total + qty * prices[i][TOTAL_DAYS], 0) + cash
      const profit = finalValue - 10000
      const newStats = {
        bestProfit: Math.max(stats.bestProfit, profit),
        gamesPlayed: stats.gamesPlayed + 1,
      }
      setStats(newStats)
      saveStats(newStats)
      setDay(TOTAL_DAYS)
      setGameOver(true)
      return
    }
    setDay(nextDay)
    const hl = headlines.find((h) => h.day === nextDay)
    setCurrentHeadline(hl ? hl.text : null)
  }

  const buy = (ci: number) => {
    if (prices.length === 0) return
    const price = prices[ci][day]
    const qty = buyAmount[ci]
    const cost = price * qty
    if (cost > cash) return
    setCash(cash - cost)
    const newHoldings = [...holdings]
    newHoldings[ci] += qty
    setHoldings(newHoldings)
  }

  const sell = (ci: number) => {
    if (prices.length === 0) return
    const price = prices[ci][day]
    const qty = Math.min(buyAmount[ci], holdings[ci])
    if (qty <= 0) return
    setCash(cash + price * qty)
    const newHoldings = [...holdings]
    newHoldings[ci] -= qty
    setHoldings(newHoldings)
  }

  const restart = () => {
    setDay(0)
    setCash(10000)
    setHoldings(companies.map(() => 0))
    setPrices(generatePrices(Date.now()))
    setCurrentHeadline(null)
    setGameOver(false)
    setBuyAmount(companies.map(() => 1))
  }

  const shareText = `I turned $10,000 into $${Math.round(portfolioValue).toLocaleString()} in 30 days of Token Trader 📈 by @mitjake\n\nhttps://jake-chen.com/play`

  if (prices.length === 0) return null

  if (gameOver) {
    const finalValue = holdings.reduce((t, q, i) => t + q * prices[i][TOTAL_DAYS], 0) + cash
    const profit = finalValue - 10000
    const pctReturn = ((profit / 10000) * 100).toFixed(1)
    return (
      <div className="space-y-4">
        <div
          className="rounded-lg border p-6 text-center"
          style={{
            borderColor: profit >= 0 ? 'var(--accent)' : 'var(--border)',
            background: profit >= 0 ? 'var(--accent-light)' : 'var(--bg)',
          }}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            30-Day Return
          </p>
          <p className="font-display text-4xl font-normal" style={{ color: 'var(--fg)' }}>
            ${Math.round(finalValue).toLocaleString()}
          </p>
          <p className="mt-1 text-sm" style={{ color: profit >= 0 ? 'var(--accent)' : 'var(--fg-muted)' }}>
            {profit >= 0 ? '+' : ''}{pctReturn}% · {profit >= 0 ? 'Not bad!' : 'The market is humbling.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={restart} className="btn-ghost flex-1">Play again</button>
          <button
            onClick={() => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}
            className="btn-primary flex-1"
          >
            Share on X
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            Day {day + 1} of {TOTAL_DAYS}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm" style={{ color: 'var(--fg)' }}>
            ${Math.round(portfolioValue).toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
            Cash: ${Math.round(cash).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Headline */}
      {currentHeadline && (
        <div
          className="rounded-md border px-3 py-2 text-sm italic"
          style={{ borderColor: 'var(--accent)', background: 'var(--accent-light)', color: 'var(--fg)' }}
        >
          📰 {currentHeadline}
        </div>
      )}

      {/* Companies */}
      <div className="space-y-2">
        {companies.map((c, ci) => {
          const price = prices[ci][day]
          const prevPrice = day > 0 ? prices[ci][day - 1] : price
          const change = ((price - prevPrice) / prevPrice) * 100
          const value = holdings[ci] * price

          return (
            <div
              key={c.ticker}
              className="rounded-md border px-3 py-2.5"
              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                      {c.ticker}
                    </span>
                    <span className="truncate text-sm" style={{ color: 'var(--fg)' }}>
                      {c.name}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs" style={{ color: 'var(--fg-subtle)' }}>
                    <span className="font-mono">${price.toFixed(2)}</span>
                    <span style={{ color: change >= 0 ? 'var(--accent)' : 'var(--fg-muted)' }}>
                      {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
                    </span>
                    {holdings[ci] > 0 && (
                      <span>Own: {holdings[ci]} (${Math.round(value).toLocaleString()})</span>
                    )}
                  </div>
                </div>
                <div className="ml-3 flex items-center gap-1.5">
                  <button
                    onClick={() => buy(ci)}
                    disabled={cash < price}
                    className="rounded border px-2 py-1 text-xs font-medium transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                    style={{
                      borderColor: 'var(--border-strong)',
                      color: 'var(--fg-muted)',
                      opacity: cash < price ? 0.4 : 1,
                    }}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => sell(ci)}
                    disabled={holdings[ci] <= 0}
                    className="rounded border px-2 py-1 text-xs font-medium transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                    style={{
                      borderColor: 'var(--border-strong)',
                      color: 'var(--fg-muted)',
                      opacity: holdings[ci] <= 0 ? 0.4 : 1,
                    }}
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mini price sparklines using inline SVG */}
      <div className="grid grid-cols-5 gap-1">
        {companies.map((c, ci) => {
          const history = prices[ci].slice(0, day + 1)
          if (history.length < 2) return <div key={c.ticker} />
          const min = Math.min(...history)
          const max = Math.max(...history)
          const range = max - min || 1
          const points = history.map((p, i) => {
            const x = (i / (TOTAL_DAYS)) * 60
            const y = 20 - ((p - min) / range) * 18
            return `${x},${y}`
          }).join(' ')

          return (
            <div key={c.ticker} className="text-center">
              <svg width="60" height="22" viewBox="0 0 60 22" className="mx-auto">
                <polyline
                  points={points}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-[9px]" style={{ color: 'var(--fg-subtle)' }}>{c.ticker}</p>
            </div>
          )
        })}
      </div>

      {/* Advance day button */}
      <button onClick={advanceDay} className="btn-primary w-full">
        {day >= TOTAL_DAYS - 1 ? 'Close Markets 🔔' : 'Next Day →'}
      </button>
    </div>
  )
}
