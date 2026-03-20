'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ─── Canvas dimensions ─── */
const W = 800
const H = 320
const GROUND_Y = 250
const PLAYER_W = 28
const PLAYER_H = 38

/* ─── Logo drawing functions (simplified brand marks drawn on canvas) ─── */
type LogoDrawFn = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => void

const drawLogoUMN: LogoDrawFn = (ctx, cx, cy, s) => {
  // Minnesota "M" — maroon block letter
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${s}px "Playfair Display", Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('M', cx, cy + 1)
}

const drawLogoDeloitte: LogoDrawFn = (ctx, cx, cy, s) => {
  // Deloitte green dot
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.4, 0, Math.PI * 2)
  ctx.fill()
}

const drawLogoMicrosoft: LogoDrawFn = (ctx, cx, cy, s) => {
  // Microsoft 4-square window
  const half = s * 0.35
  const gap = 1.5
  ctx.fillStyle = '#F25022'; ctx.fillRect(cx - half - gap / 2, cy - half - gap / 2, half, half) // red
  ctx.fillStyle = '#7FBA00'; ctx.fillRect(cx + gap / 2, cy - half - gap / 2, half, half) // green
  ctx.fillStyle = '#00A4EF'; ctx.fillRect(cx - half - gap / 2, cy + gap / 2, half, half) // blue
  ctx.fillStyle = '#FFB900'; ctx.fillRect(cx + gap / 2, cy + gap / 2, half, half) // yellow
}

const drawLogoHubSpot: LogoDrawFn = (ctx, cx, cy, s) => {
  // HubSpot sprocket — simplified gear shape
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.3, 0, Math.PI * 2)
  ctx.stroke()
  // Spokes
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * s * 0.3, cy + Math.sin(angle) * s * 0.3)
    ctx.lineTo(cx + Math.cos(angle) * s * 0.48, cy + Math.sin(angle) * s * 0.48)
    ctx.stroke()
  }
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(cx, cy, s * 0.12, 0, Math.PI * 2)
  ctx.fill()
}

const drawLogoMIT: LogoDrawFn = (ctx, cx, cy, s) => {
  // MIT block letters
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${s * 0.7}px "Inter", system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('MIT', cx, cy + 1)
}

const drawLogoMcKinsey: LogoDrawFn = (ctx, cx, cy, s) => {
  // McKinsey — stylized "Mc" text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `600 ${s * 0.55}px "Playfair Display", Georgia, serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('McK', cx, cy + 1)
}

const drawLogoWaymo: LogoDrawFn = (ctx, cx, cy, s) => {
  // Waymo — "W" with a small circle (sensor dot)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${s * 0.8}px "Inter", system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('W', cx, cy)
  // Sensor dot above
  ctx.beginPath()
  ctx.arc(cx, cy - s * 0.42, 2, 0, Math.PI * 2)
  ctx.fill()
}

/* ─── Career milestones (chronological) ─── */
interface Milestone {
  year: string
  title: string
  company: string
  detail: string
  color: string
  drawLogo: LogoDrawFn
}

const MILESTONES: Milestone[] = [
  {
    year: '2007',
    title: 'B.S. Finance & MIS',
    company: 'University of Minnesota',
    detail: 'Double major in Finance and Information Systems. First spark of interest in how complex systems create value.',
    color: '#7A0019',
    drawLogo: drawLogoUMN,
  },
  {
    year: '2009–2014',
    title: 'Consultant → Senior',
    company: 'Deloitte',
    detail: 'Five years across TMT and financial services. Customer acquisition, platform strategy, digital transformation. Learned to structure ambiguous problems.',
    color: '#86B817',
    drawLogo: drawLogoDeloitte,
  },
  {
    year: '2015',
    title: 'Program Manager',
    company: 'Microsoft',
    detail: 'Product strategy for Office 365 — onboarding, churn reduction, retention. First exposure to enterprise software meets user behavior.',
    color: '#0078D4',
    drawLogo: drawLogoMicrosoft,
  },
  {
    year: '2015–2016',
    title: 'Analytics & Insights',
    company: 'HubSpot',
    detail: 'Built prospect scoring models and A/B testing programs. Growth teams operate fast — data-driven, allergic to vanity metrics.',
    color: '#FF7A59',
    drawLogo: drawLogoHubSpot,
  },
  {
    year: '2016',
    title: 'MBA',
    company: 'MIT Sloan',
    detail: 'Focused on technology strategy and operations. Where analytical rigor met real-world messiness.',
    color: '#A31F34',
    drawLogo: drawLogoMIT,
  },
  {
    year: '2016–2019',
    title: 'Engagement Manager',
    company: 'McKinsey & Company',
    detail: 'Led growth strategy, pricing, and M&A engagements across tech, media, financial services, and retail. Managed teams of 3–8.',
    color: '#003B5C',
    drawLogo: drawLogoMcKinsey,
  },
  {
    year: '2019–Present',
    title: 'Strategy Lead',
    company: 'Waymo',
    detail: 'Executive-level strategy for autonomous mobility. Go-to-market, pricing architecture, competitive positioning. AI meets the real world.',
    color: '#00BFA5',
    drawLogo: drawLogoWaymo,
  },
]

/* ─── Obstacle tied to a milestone ─── */
interface Block {
  x: number
  w: number
  h: number
  milestone: Milestone
  cleared: boolean
  falling: boolean
  fallY: number
  fallVel: number
}

type GameState = 'idle' | 'running' | 'complete' | 'dead'

export default function ResumeRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<GameState>('idle')
  const [clearedMilestones, setClearedMilestones] = useState<Milestone[]>([])
  const [showFullResume, setShowFullResume] = useState(false)
  const [canvasScale, setCanvasScale] = useState(1)

  // Refs for game loop
  const stateRef = useRef<GameState>('idle')
  const playerRef = useRef({ x: 80, y: GROUND_Y - PLAYER_H, vy: 0, jumping: false, doubleJumped: false })
  const blocksRef = useRef<Block[]>([])
  const clearedRef = useRef<Milestone[]>([])
  const nextMilestoneRef = useRef(0)
  const speedRef = useRef(3.5)
  const frameRef = useRef(0)
  const distRef = useRef(0)
  const animRef = useRef<number>(0)

  // Responsive scaling
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth
        setCanvasScale(Math.min(1, cw / W))
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const GRAVITY = 0.65
  const JUMP_FORCE = -12.5
  const DOUBLE_JUMP_FORCE = -10

  /* ─── Spawn next milestone block ─── */
  const spawnNext = useCallback(() => {
    const idx = nextMilestoneRef.current
    if (idx >= MILESTONES.length) return
    const m = MILESTONES[idx]
    const blockW = 80
    const blockH = 58 + Math.random() * 12
    blocksRef.current.push({
      x: W + 40,
      w: blockW,
      h: blockH,
      milestone: m,
      cleared: false,
      falling: false,
      fallY: GROUND_Y - blockH,
      fallVel: 0,
    })
    nextMilestoneRef.current = idx + 1
  }, [])

  /* ─── Start / Restart ─── */
  const startGame = useCallback(() => {
    playerRef.current = { x: 80, y: GROUND_Y - PLAYER_H, vy: 0, jumping: false, doubleJumped: false }
    blocksRef.current = []
    clearedRef.current = []
    nextMilestoneRef.current = 0
    speedRef.current = 3.5
    frameRef.current = 0
    distRef.current = 0
    setClearedMilestones([])
    setShowFullResume(false)
    setGameState('running')
    stateRef.current = 'running'
    // Spawn first block
    spawnNext()
  }, [spawnNext])

  /* ─── Jump ─── */
  const jump = useCallback(() => {
    const p = playerRef.current
    if (stateRef.current === 'idle') {
      startGame()
      return
    }
    if (stateRef.current === 'complete' || stateRef.current === 'dead') return

    if (!p.jumping) {
      p.vy = JUMP_FORCE
      p.jumping = true
      p.doubleJumped = false
    } else if (!p.doubleJumped) {
      p.vy = DOUBLE_JUMP_FORCE
      p.doubleJumped = true
    }
  }, [startGame])

  /* ─── Input handlers ─── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  /* ─── Game loop ─── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const loop = () => {
      animRef.current = requestAnimationFrame(loop)
      const state = stateRef.current
      const p = playerRef.current
      const blocks = blocksRef.current

      frameRef.current++
      ctx.clearRect(0, 0, W, H)

      // ── Background ──
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#FAFAF8'
      ctx.fillRect(0, 0, W, H)

      // ── Ground line ──
      const fgSubtle = getComputedStyle(document.documentElement).getPropertyValue('--fg-subtle').trim() || '#8E8E9A'
      ctx.strokeStyle = fgSubtle
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, GROUND_Y)
      ctx.lineTo(W, GROUND_Y)
      ctx.stroke()

      // ── Ground hash marks (scrolling) ──
      if (state === 'running') {
        distRef.current += speedRef.current
      }
      const offset = distRef.current % 30
      ctx.strokeStyle = fgSubtle
      ctx.lineWidth = 0.5
      for (let x = -offset; x < W; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, GROUND_Y)
        ctx.lineTo(x + 6, GROUND_Y + 6)
        ctx.stroke()
      }

      // ── Update physics ──
      if (state === 'running') {
        // Gravity
        p.vy += GRAVITY
        p.y += p.vy
        if (p.y >= GROUND_Y - PLAYER_H) {
          p.y = GROUND_Y - PLAYER_H
          p.vy = 0
          p.jumping = false
          p.doubleJumped = false
        }

        // Speed ramp
        speedRef.current = Math.min(7, 3.5 + frameRef.current * 0.0005)

        // Move blocks
        for (const b of blocks) {
          if (!b.falling) {
            b.x -= speedRef.current
          }
        }

        // Check cleared
        for (const b of blocks) {
          if (!b.cleared && b.x + b.w < p.x) {
            b.cleared = true
            b.falling = true
            b.fallY = GROUND_Y - b.h
            b.fallVel = 0
            clearedRef.current = [...clearedRef.current, b.milestone]
            setClearedMilestones([...clearedRef.current])

            // Spawn next if available
            if (nextMilestoneRef.current < MILESTONES.length) {
              // Delay spawn slightly
              setTimeout(() => spawnNext(), 300)
            } else {
              // All milestones cleared — win!
              setTimeout(() => {
                stateRef.current = 'complete'
                setGameState('complete')
                setShowFullResume(true)
              }, 800)
            }
          }
        }

        // Collision detection
        for (const b of blocks) {
          if (b.cleared || b.falling) continue
          const px = p.x, py = p.y, pw = PLAYER_W, ph = PLAYER_H
          if (
            px + pw > b.x + 4 &&
            px < b.x + b.w - 4 &&
            py + ph > GROUND_Y - b.h + 4 &&
            py < GROUND_Y
          ) {
            stateRef.current = 'dead'
            setGameState('dead')
          }
        }

        // Remove offscreen blocks that are falling
        blocksRef.current = blocks.filter((b) => {
          if (b.falling && b.fallY > H + 100) return false
          if (!b.falling && b.x + b.w < -100) return false
          return true
        })
      }

      // ── Animate falling blocks ──
      for (const b of blocks) {
        if (b.falling) {
          b.fallVel += 0.5
          b.fallY += b.fallVel
        }
      }

      // ── Draw blocks ──
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#1A1A2E'
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#FAFAF8'

      for (const b of blocks) {
        const bx = b.x
        const by = b.falling ? b.fallY : GROUND_Y - b.h
        const bw = b.w
        const bh = b.h

        // Block body
        ctx.fillStyle = b.milestone.color
        ctx.beginPath()
        const r = 6
        ctx.moveTo(bx + r, by)
        ctx.lineTo(bx + bw - r, by)
        ctx.arcTo(bx + bw, by, bx + bw, by + r, r)
        ctx.lineTo(bx + bw, by + bh - r)
        ctx.arcTo(bx + bw, by + bh, bx + bw - r, by + bh, r)
        ctx.lineTo(bx + r, by + bh)
        ctx.arcTo(bx, by + bh, bx, by + bh - r, r)
        ctx.lineTo(bx, by + r)
        ctx.arcTo(bx, by, bx + r, by, r)
        ctx.fill()

        // Logo on block (centered in upper portion)
        ctx.save()
        b.milestone.drawLogo(ctx, bx + bw / 2, by + bh * 0.38, 20)
        ctx.restore()

        // Company label below logo
        ctx.font = '7px Inter, system-ui, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        const companyText = b.milestone.company.length > 12
          ? b.milestone.company.slice(0, 11) + '…'
          : b.milestone.company
        ctx.fillText(companyText, bx + bw / 2, by + bh - 6)
      }

      // ── Draw player ──
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#B45309'
      const px = p.x
      const py = p.y

      // Body
      ctx.fillStyle = fg
      ctx.beginPath()
      ctx.roundRect(px + 4, py + 12, 20, 22, 3)
      ctx.fill()

      // Head
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(px + 14, py + 8, 8, 0, Math.PI * 2)
      ctx.fill()

      // Eyes (show direction)
      ctx.fillStyle = bgColor
      ctx.beginPath()
      ctx.arc(px + 17, py + 7, 2, 0, Math.PI * 2)
      ctx.fill()

      // Running legs
      if (state === 'running' && !p.jumping) {
        const legPhase = Math.sin(frameRef.current * 0.3)
        ctx.strokeStyle = fg
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        // Left leg
        ctx.beginPath()
        ctx.moveTo(px + 10, py + 34)
        ctx.lineTo(px + 10 + legPhase * 6, py + PLAYER_H)
        ctx.stroke()
        // Right leg
        ctx.beginPath()
        ctx.moveTo(px + 18, py + 34)
        ctx.lineTo(px + 18 - legPhase * 6, py + PLAYER_H)
        ctx.stroke()
      } else {
        // Standing / jumping legs
        ctx.strokeStyle = fg
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(px + 10, py + 34)
        ctx.lineTo(px + 8, py + PLAYER_H)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(px + 18, py + 34)
        ctx.lineTo(px + 20, py + PLAYER_H)
        ctx.stroke()
      }

      // ── Progress bar ──
      const progress = clearedRef.current.length / MILESTONES.length
      ctx.fillStyle = 'rgba(128,128,128,0.2)'
      ctx.fillRect(20, 12, W - 40, 6)
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.roundRect(20, 12, (W - 40) * progress, 6, 3)
      ctx.fill()

      // Progress label
      ctx.fillStyle = fgSubtle
      ctx.font = '10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`${clearedRef.current.length} / ${MILESTONES.length} milestones`, 20, 32)

      // ── Idle screen ──
      if (state === 'idle') {
        ctx.fillStyle = fg
        ctx.font = '600 22px "Playfair Display", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText('Run Through My Resume', W / 2, H / 2 - 30)

        ctx.font = '13px Inter, system-ui, sans-serif'
        ctx.fillStyle = fgSubtle
        ctx.fillText('Jump over each career milestone to build my resume below', W / 2, H / 2)

        ctx.font = '600 14px Inter, system-ui, sans-serif'
        ctx.fillStyle = accent
        ctx.fillText('Press Space or Tap to Start', W / 2, H / 2 + 30)
      }

      // ── Dead screen ──
      if (state === 'dead') {
        ctx.fillStyle = 'rgba(0,0,0,0.4)'
        ctx.fillRect(0, 0, W, H)

        ctx.fillStyle = '#fff'
        ctx.font = '600 22px "Playfair Display", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText('Career Interrupted!', W / 2, H / 2 - 20)

        ctx.font = '13px Inter, system-ui, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.fillText(`Cleared ${clearedRef.current.length} of ${MILESTONES.length} milestones`, W / 2, H / 2 + 8)

        ctx.font = '600 13px Inter, system-ui, sans-serif'
        ctx.fillStyle = accent
        ctx.fillText('Tap or Press Space to Try Again', W / 2, H / 2 + 36)
      }

      // ── Win screen ──
      if (state === 'complete') {
        ctx.fillStyle = accent
        ctx.font = '600 22px "Playfair Display", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.fillText('Resume Complete!', W / 2, H / 2 - 10)

        ctx.font = '13px Inter, system-ui, sans-serif'
        ctx.fillStyle = fgSubtle
        ctx.fillText('Scroll down to see the full picture', W / 2, H / 2 + 16)
      }
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [spawnNext])

  const handleCanvasClick = useCallback(() => {
    if (stateRef.current === 'dead') {
      startGame()
    } else {
      jump()
    }
  }, [jump, startGame])

  return (
    <div ref={containerRef}>
      {/* Canvas */}
      <div
        className="overflow-hidden rounded-lg border"
        style={{ borderColor: 'var(--border-strong)' }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={handleCanvasClick}
          onTouchStart={(e) => { e.preventDefault(); handleCanvasClick() }}
          style={{
            width: W * canvasScale,
            height: H * canvasScale,
            display: 'block',
            cursor: 'pointer',
          }}
          role="img"
          aria-label="Resume Runner game — jump over career milestones to build Jake's resume"
        />
      </div>

      {/* Mobile hint */}
      <p className="mt-2 text-center text-[10px] sm:hidden" style={{ color: 'var(--fg-subtle)' }}>
        Tap to jump · Double tap for double jump
      </p>
      <p className="mt-2 hidden text-center text-[10px] sm:block" style={{ color: 'var(--fg-subtle)' }}>
        Space or ↑ to jump · Press twice for double jump
      </p>

      {/* Cleared milestones — build up as you play */}
      {clearedMilestones.length > 0 && (
        <div className="mt-6">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            {showFullResume ? 'The full picture' : 'Building the resume…'}
          </p>
          <div className="space-y-0">
            {clearedMilestones.map((m, i) => (
              <div
                key={m.year}
                className="flex gap-4 border-l-2 py-3 pl-4"
                style={{
                  borderColor: m.color,
                  animation: `fadeUp 0.4s ease-out ${i * 0.05}s both`,
                }}
              >
                <div className="w-20 shrink-0">
                  <p className="text-xs font-semibold" style={{ color: m.color }}>
                    {m.year}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                    {m.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--fg-subtle)' }}>
                    {m.company}
                  </p>
                  {showFullResume && (
                    <p
                      className="mt-1 text-xs leading-relaxed"
                      style={{ color: 'var(--fg-muted)' }}
                    >
                      {m.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Win state CTA */}
          {showFullResume && (
            <div
              className="mt-6 rounded-lg border p-5 text-center"
              style={{
                borderColor: 'var(--accent)',
                background: 'var(--accent-light)',
                animation: 'fadeUp 0.5s ease-out 0.3s both',
              }}
            >
              <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                You made it through my entire career!
              </p>
              <p className="mb-4 text-xs" style={{ color: 'var(--fg-muted)' }}>
                Now that you know my background, let&apos;s connect.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="mailto:hello@jake-chen.com" className="btn-primary text-xs">
                  Say hello
                </a>
                <a
                  href="https://linkedin.com/in/jiakechen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-xs"
                >
                  LinkedIn
                </a>
                <a href="/writing" className="btn-ghost text-xs">
                  Read my essays
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
