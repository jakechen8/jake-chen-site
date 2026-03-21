'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ─── Canvas dimensions ─── */
const W = 800
const H = 360
const GROUND_Y = 280
const PLAYER_W = 32
const PLAYER_H = 50

/* ─── Logo paths (SVGs served from /public) ─── */
const LOGO_PATHS: Record<string, string> = {
  umn: '/images/logos/umn.svg',
  deloitte: '/images/logos/deloitte.svg',
  microsoft: '/images/logos/microsoft.svg',
  hubspot: '/images/logos/hubspot.svg',
  mit: '/images/logos/mit.svg',
  mckinsey: '/images/logos/mckinsey.svg',
  waymo: '/images/logos/waymo.svg',
}

/* ─── Particle system ─── */
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  type: 'burst' | 'dust' | 'trail' | 'star'
}

/* ─── Career milestones (chronological) ─── */
interface Milestone {
  year: string
  title: string
  company: string
  detail: string
  color: string
  colorLight: string
  logoKey: string
}

const MILESTONES: Milestone[] = [
  {
    year: '2007',
    title: 'B.S. Finance & MIS',
    company: 'University of Minnesota',
    detail: 'Double major in Finance and Information Systems. First spark of interest in how complex systems create value.',
    color: '#7A0019',
    colorLight: '#9B1B30',
    logoKey: 'umn',
  },
  {
    year: '2009–2014',
    title: 'Consultant → Senior',
    company: 'Deloitte',
    detail: 'Five years across TMT and financial services. Customer acquisition, platform strategy, digital transformation. Learned to structure ambiguous problems.',
    color: '#86B817',
    colorLight: '#9FD42E',
    logoKey: 'deloitte',
  },
  {
    year: '2015',
    title: 'Program Manager',
    company: 'Microsoft',
    detail: 'Product strategy for Office 365 — onboarding, churn reduction, retention. First exposure to enterprise software meets user behavior.',
    color: '#0078D4',
    colorLight: '#1A8FE8',
    logoKey: 'microsoft',
  },
  {
    year: '2015–2016',
    title: 'Analytics & Insights',
    company: 'HubSpot',
    detail: 'Built prospect scoring models and A/B testing programs. Growth teams operate fast — data-driven, allergic to vanity metrics.',
    color: '#FF7A59',
    colorLight: '#FF9A80',
    logoKey: 'hubspot',
  },
  {
    year: '2016',
    title: 'MBA',
    company: 'MIT Sloan',
    detail: 'Focused on technology strategy and operations. Where analytical rigor met real-world messiness.',
    color: '#A31F34',
    colorLight: '#C4354C',
    logoKey: 'mit',
  },
  {
    year: '2016–2019',
    title: 'Engagement Manager',
    company: 'McKinsey & Company',
    detail: 'Led growth strategy, pricing, and M&A engagements across tech, media, financial services, and retail. Managed teams of 3–8.',
    color: '#003B5C',
    colorLight: '#005580',
    logoKey: 'mckinsey',
  },
  {
    year: '2019–Present',
    title: 'Strategy Lead',
    company: 'Waymo',
    detail: 'Executive-level strategy for autonomous mobility. Go-to-market, pricing architecture, competitive positioning. AI meets the real world.',
    color: '#00BFA5',
    colorLight: '#1AD6BB',
    logoKey: 'waymo',
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
  fallRotation: number
  opacity: number
}

type GameState = 'idle' | 'running' | 'complete' | 'dead'

/* ─── Helper: rounded rect path ─── */
function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

/* ─── Helper: hex to rgba ─── */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function ResumeRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<GameState>('idle')
  const [clearedMilestones, setClearedMilestones] = useState<Milestone[]>([])
  const [showFullResume, setShowFullResume] = useState(false)
  const [canvasScale, setCanvasScale] = useState(1)

  // Refs for game loop
  const stateRef = useRef<GameState>('idle')
  const playerRef = useRef({ x: 100, y: GROUND_Y - PLAYER_H, vy: 0, jumping: false, doubleJumped: false, wasJumping: false, landFrame: 0 })
  const blocksRef = useRef<Block[]>([])
  const clearedRef = useRef<Milestone[]>([])
  const nextMilestoneRef = useRef(0)
  const speedRef = useRef(3.5)
  const frameRef = useRef(0)
  const distRef = useRef(0)
  const animRef = useRef<number>(0)
  const logosRef = useRef<Record<string, HTMLImageElement>>({})
  const particlesRef = useRef<Particle[]>([])
  const screenFlashRef = useRef(0)
  const shakeRef = useRef({ x: 0, y: 0, intensity: 0 })

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

  // Preload logo images
  useEffect(() => {
    const loaded: Record<string, HTMLImageElement> = {}
    for (const [key, path] of Object.entries(LOGO_PATHS)) {
      const img = new Image()
      img.src = path
      loaded[key] = img
    }
    logosRef.current = loaded
  }, [])

  const GRAVITY = 0.62
  const JUMP_FORCE = -13
  const DOUBLE_JUMP_FORCE = -10.5

  /* ─── Spawn particles ─── */
  const spawnBurst = useCallback((x: number, y: number, color: string, count: number) => {
    const newP: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const speed = 2 + Math.random() * 4
      newP.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 30 + Math.random() * 20,
        color,
        size: 2 + Math.random() * 4,
        type: 'burst',
      })
    }
    // Also spawn stars
    for (let i = 0; i < 5; i++) {
      newP.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y - Math.random() * 30,
        vx: (Math.random() - 0.5) * 2,
        vy: -1 - Math.random() * 3,
        life: 1,
        maxLife: 40 + Math.random() * 20,
        color: '#FFD700',
        size: 3 + Math.random() * 3,
        type: 'star',
      })
    }
    particlesRef.current.push(...newP)
  }, [])

  const spawnDust = useCallback((x: number, y: number) => {
    if (Math.random() > 0.3) return
    particlesRef.current.push({
      x: x + Math.random() * 10,
      y,
      vx: -1 - Math.random() * 2,
      vy: -0.5 - Math.random() * 1.5,
      life: 1,
      maxLife: 15 + Math.random() * 10,
      color: 'rgba(160,155,145,0.5)',
      size: 1.5 + Math.random() * 2.5,
      type: 'dust',
    })
  }, [])

  const spawnTrail = useCallback((x: number, y: number, color: string) => {
    particlesRef.current.push({
      x, y,
      vx: -0.5 + Math.random() * -1,
      vy: (Math.random() - 0.5) * 0.5,
      life: 1,
      maxLife: 12 + Math.random() * 6,
      color,
      size: 2 + Math.random() * 2,
      type: 'trail',
    })
  }, [])

  /* ─── Spawn next milestone block ─── */
  const spawnNext = useCallback(() => {
    const idx = nextMilestoneRef.current
    if (idx >= MILESTONES.length) return
    const m = MILESTONES[idx]
    const blockW = 94
    const blockH = 78 + Math.random() * 12
    blocksRef.current.push({
      x: W + 60,
      w: blockW,
      h: blockH,
      milestone: m,
      cleared: false,
      falling: false,
      fallY: GROUND_Y - blockH,
      fallVel: 0,
      fallRotation: 0,
      opacity: 1,
    })
    nextMilestoneRef.current = idx + 1
  }, [])

  /* ─── Start / Restart ─── */
  const startGame = useCallback(() => {
    playerRef.current = { x: 100, y: GROUND_Y - PLAYER_H, vy: 0, jumping: false, doubleJumped: false, wasJumping: false, landFrame: 0 }
    blocksRef.current = []
    clearedRef.current = []
    nextMilestoneRef.current = 0
    speedRef.current = 3.5
    frameRef.current = 0
    distRef.current = 0
    particlesRef.current = []
    screenFlashRef.current = 0
    shakeRef.current = { x: 0, y: 0, intensity: 0 }
    setClearedMilestones([])
    setShowFullResume(false)
    setGameState('running')
    stateRef.current = 'running'
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
      // Jump dust
      for (let i = 0; i < 6; i++) {
        particlesRef.current.push({
          x: p.x + PLAYER_W / 2 + (Math.random() - 0.5) * 20,
          y: GROUND_Y,
          vx: (Math.random() - 0.5) * 3,
          vy: -1 - Math.random() * 2,
          life: 1,
          maxLife: 15 + Math.random() * 10,
          color: 'rgba(160,155,145,0.6)',
          size: 2 + Math.random() * 3,
          type: 'dust',
        })
      }
    } else if (!p.doubleJumped) {
      p.vy = DOUBLE_JUMP_FORCE
      p.doubleJumped = true
      // Double jump burst
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8
        particlesRef.current.push({
          x: p.x + PLAYER_W / 2,
          y: p.y + PLAYER_H / 2,
          vx: Math.cos(angle) * 2,
          vy: Math.sin(angle) * 2,
          life: 1,
          maxLife: 10,
          color: 'rgba(180,83,9,0.5)',
          size: 2,
          type: 'trail',
        })
      }
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

  /* ─── Draw a star shape ─── */
  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, points: number) => {
    ctx.beginPath()
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2
      const radius = i % 2 === 0 ? r : r * 0.4
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
  }

  /* ─── Game loop ─── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Cache CSS values (read once, update periodically)
    let cssFrame = 0
    let bgColor = '#FAFAF8'
    let fgColor = '#1A1A2E'
    let fgSubtle = '#8E8E9A'
    let accent = '#B45309'
    let borderColor = '#E5E5E5'

    const readCSS = () => {
      const s = getComputedStyle(document.documentElement)
      bgColor = s.getPropertyValue('--bg').trim() || '#FAFAF8'
      fgColor = s.getPropertyValue('--fg').trim() || '#1A1A2E'
      fgSubtle = s.getPropertyValue('--fg-subtle').trim() || '#8E8E9A'
      accent = s.getPropertyValue('--accent').trim() || '#B45309'
      borderColor = s.getPropertyValue('--border').trim() || '#E5E5E5'
    }
    readCSS()

    const loop = () => {
      animRef.current = requestAnimationFrame(loop)
      const state = stateRef.current
      const p = playerRef.current
      const blocks = blocksRef.current
      const particles = particlesRef.current

      frameRef.current++
      cssFrame++
      if (cssFrame % 60 === 0) readCSS()

      // Screen shake decay
      const shake = shakeRef.current
      if (shake.intensity > 0) {
        shake.x = (Math.random() - 0.5) * shake.intensity
        shake.y = (Math.random() - 0.5) * shake.intensity
        shake.intensity *= 0.88
        if (shake.intensity < 0.3) shake.intensity = 0
      }

      ctx.save()
      ctx.translate(shake.x, shake.y)
      ctx.clearRect(-10, -10, W + 20, H + 20)

      // ── Background ──
      ctx.fillStyle = bgColor
      ctx.fillRect(-10, -10, W + 20, H + 20)

      // ── Subtle background dots ──
      ctx.fillStyle = hexToRgba(fgSubtle, 0.07)
      const dotOffset = (distRef.current * 0.3) % 40
      for (let dx = -dotOffset; dx < W + 40; dx += 40) {
        for (let dy = 20; dy < GROUND_Y - 20; dy += 40) {
          ctx.beginPath()
          ctx.arc(dx, dy, 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ── Ground ──
      // Main ground line
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, GROUND_Y)
      ctx.lineTo(W, GROUND_Y)
      ctx.stroke()

      // Ground texture (subtle hash marks)
      if (state === 'running') {
        distRef.current += speedRef.current
      }
      const offset = distRef.current % 24
      ctx.strokeStyle = hexToRgba(fgSubtle, 0.15)
      ctx.lineWidth = 1
      for (let x = -offset; x < W; x += 24) {
        ctx.beginPath()
        ctx.moveTo(x, GROUND_Y + 1)
        ctx.lineTo(x + 8, GROUND_Y + 10)
        ctx.stroke()
      }

      // Subtle ground fill below line
      const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, H)
      groundGrad.addColorStop(0, hexToRgba(fgSubtle, 0.03))
      groundGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = groundGrad
      ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y)

      // ── Parallax background hills ──
      if (state === 'running' || state === 'idle') {
        const hillColor = hexToRgba(fgSubtle, 0.04)
        const hillOffset1 = (distRef.current * 0.15) % W
        const hillOffset2 = (distRef.current * 0.08) % W

        // Far hills
        ctx.fillStyle = hillColor
        ctx.beginPath()
        ctx.moveTo(0, GROUND_Y)
        for (let hx = -50; hx < W + 50; hx += 10) {
          const hy = GROUND_Y - 30 - Math.sin((hx + hillOffset2) * 0.008) * 25 - Math.sin((hx + hillOffset2) * 0.003) * 15
          ctx.lineTo(hx, hy)
        }
        ctx.lineTo(W + 50, GROUND_Y)
        ctx.closePath()
        ctx.fill()

        // Near hills
        ctx.fillStyle = hexToRgba(fgSubtle, 0.03)
        ctx.beginPath()
        ctx.moveTo(0, GROUND_Y)
        for (let hx = -50; hx < W + 50; hx += 10) {
          const hy = GROUND_Y - 15 - Math.sin((hx + hillOffset1) * 0.012) * 18 - Math.sin((hx + hillOffset1) * 0.005) * 10
          ctx.lineTo(hx, hy)
        }
        ctx.lineTo(W + 50, GROUND_Y)
        ctx.closePath()
        ctx.fill()
      }

      // ── Update physics ──
      if (state === 'running') {
        p.vy += GRAVITY
        p.y += p.vy
        p.wasJumping = p.jumping
        if (p.y >= GROUND_Y - PLAYER_H) {
          p.y = GROUND_Y - PLAYER_H
          // Landing detection
          if (p.wasJumping && p.vy > 4) {
            p.landFrame = frameRef.current
            // Landing dust burst
            for (let i = 0; i < 8; i++) {
              particlesRef.current.push({
                x: p.x + PLAYER_W / 2 + (Math.random() - 0.5) * 24,
                y: GROUND_Y,
                vx: (Math.random() - 0.5) * 4,
                vy: -1.5 - Math.random() * 2,
                life: 1,
                maxLife: 12 + Math.random() * 8,
                color: 'rgba(160,155,145,0.7)',
                size: 2 + Math.random() * 3,
                type: 'dust',
              })
            }
            shakeRef.current.intensity = 2
          }
          p.vy = 0
          p.jumping = false
          p.doubleJumped = false
        }

        speedRef.current = Math.min(6.5, 3.5 + frameRef.current * 0.0004)

        // Running dust
        if (!p.jumping) {
          spawnDust(p.x, GROUND_Y)
        }

        // Player trail when jumping
        if (p.jumping) {
          spawnTrail(p.x + PLAYER_W / 2, p.y + PLAYER_H / 2, hexToRgba(accent, 0.3))
        }

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
            b.fallRotation = 0
            clearedRef.current = [...clearedRef.current, b.milestone]
            setClearedMilestones([...clearedRef.current])

            // Celebration effects
            spawnBurst(b.x + b.w / 2, GROUND_Y - b.h / 2, b.milestone.color, 18)
            screenFlashRef.current = 1
            shakeRef.current.intensity = 4

            if (nextMilestoneRef.current < MILESTONES.length) {
              setTimeout(() => spawnNext(), 400)
            } else {
              // Big win celebration
              setTimeout(() => {
                spawnBurst(W / 2, H / 2, accent, 30)
                spawnBurst(W / 3, H / 2, '#FFD700', 20)
                spawnBurst((W * 2) / 3, H / 2, '#FFD700', 20)
                shakeRef.current.intensity = 8
                screenFlashRef.current = 1
              }, 400)
              setTimeout(() => {
                stateRef.current = 'complete'
                setGameState('complete')
                setShowFullResume(true)
              }, 900)
            }
          }
        }

        // Collision detection
        for (const b of blocks) {
          if (b.cleared || b.falling) continue
          const px = p.x, py = p.y, pw = PLAYER_W, ph = PLAYER_H
          if (
            px + pw > b.x + 6 &&
            px < b.x + b.w - 6 &&
            py + ph > GROUND_Y - b.h + 6 &&
            py < GROUND_Y
          ) {
            stateRef.current = 'dead'
            setGameState('dead')
            shakeRef.current.intensity = 10
            // Death particles
            for (let i = 0; i < 12; i++) {
              particlesRef.current.push({
                x: px + pw / 2,
                y: py + ph / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: -2 - Math.random() * 4,
                life: 1,
                maxLife: 25 + Math.random() * 15,
                color: accent,
                size: 2 + Math.random() * 3,
                type: 'burst',
              })
            }
          }
        }

        // Remove offscreen blocks
        blocksRef.current = blocks.filter((b) => {
          if (b.falling && b.fallY > H + 100) return false
          if (!b.falling && b.x + b.w < -100) return false
          return true
        })
      }

      // ── Animate falling blocks ──
      for (const b of blocks) {
        if (b.falling) {
          b.fallVel += 0.6
          b.fallY += b.fallVel
          b.fallRotation += 0.03
          b.opacity = Math.max(0, b.opacity - 0.015)
        }
      }

      // ── Update & draw particles ──
      for (let i = particles.length - 1; i >= 0; i--) {
        const part = particles[i]
        part.x += part.vx
        part.y += part.vy
        if (part.type === 'burst') part.vy += 0.1
        if (part.type === 'dust') part.vy -= 0.02
        part.life -= 1 / part.maxLife
        if (part.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.globalAlpha = part.life * (part.type === 'dust' ? 0.6 : 1)

        if (part.type === 'star') {
          ctx.fillStyle = part.color
          drawStar(ctx, part.x, part.y, part.size * part.life, 4)
          ctx.fill()
        } else {
          ctx.fillStyle = part.color
          ctx.beginPath()
          ctx.arc(part.x, part.y, part.size * (part.type === 'burst' ? part.life : 1), 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1

      // ── Draw blocks (card-style: white card with colored accent) ──
      for (const b of blocks) {
        const bx = b.x
        const by = b.falling ? b.fallY : GROUND_Y - b.h
        const bw = b.w
        const bh = b.h

        ctx.save()
        ctx.globalAlpha = b.opacity

        if (b.falling) {
          const cx = bx + bw / 2
          const cy = by + bh / 2
          ctx.translate(cx, cy)
          ctx.rotate(b.fallRotation)
          ctx.translate(-cx, -cy)
        }

        // Card shadow
        if (!b.falling) {
          ctx.fillStyle = 'rgba(0,0,0,0.12)'
          roundedRect(ctx, bx + 2, by + 3, bw, bh, 10)
          ctx.fill()
        }

        // White card body
        ctx.fillStyle = '#FFFFFF'
        roundedRect(ctx, bx, by, bw, bh, 10)
        ctx.fill()

        // Colored accent strip on top
        ctx.save()
        ctx.beginPath()
        roundedRect(ctx, bx, by, bw, 8, 10)
        ctx.clip()
        ctx.fillStyle = b.milestone.color
        ctx.fillRect(bx, by, bw, 14) // slightly taller to fill rounded bottom
        ctx.restore()

        // Subtle card border
        ctx.strokeStyle = hexToRgba(b.milestone.color, 0.25)
        ctx.lineWidth = 1
        roundedRect(ctx, bx, by, bw, bh, 10)
        ctx.stroke()

        // Logo on card (centered, large)
        const logoImg = logosRef.current[b.milestone.logoKey]
        if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
          const logoSize = 38
          ctx.drawImage(
            logoImg,
            bx + (bw - logoSize) / 2,
            by + 12 + (bh - 12 - logoSize) / 2 - 2,
            logoSize,
            logoSize,
          )
        }

        // Year label at bottom
        ctx.font = '600 8px Inter, system-ui, sans-serif'
        ctx.fillStyle = b.milestone.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(b.milestone.year, bx + bw / 2, by + bh - 6)

        ctx.restore()
      }

      // ── Speed lines when fast ──
      if (state === 'running' && speedRef.current > 4.5) {
        const lineAlpha = (speedRef.current - 4.5) / 3
        ctx.strokeStyle = hexToRgba(accent, lineAlpha * 0.15)
        ctx.lineWidth = 1
        for (let i = 0; i < 4; i++) {
          const ly = 80 + i * 50 + Math.sin(frameRef.current * 0.1 + i) * 15
          const lx = 50 + Math.sin(frameRef.current * 0.05 + i * 2) * 30
          const len = 30 + speedRef.current * 8
          ctx.beginPath()
          ctx.moveTo(lx, ly)
          ctx.lineTo(lx + len, ly)
          ctx.stroke()
        }
      }

      // ── Draw player ──
      const px = p.x
      const py = p.y
      const cx = px + PLAYER_W / 2
      const frame = frameRef.current

      // Squash/stretch
      let scaleX = 1, scaleY = 1
      const landAge = frame - p.landFrame
      if (!p.jumping && landAge < 8) {
        // Landing squash
        const t = landAge / 8
        const squash = Math.sin(t * Math.PI) * 0.18
        scaleX = 1 + squash
        scaleY = 1 - squash
      } else if (p.jumping && p.vy < -6) {
        // Stretch upward
        scaleX = 0.88
        scaleY = 1.12
      } else if (p.jumping && p.vy > 6) {
        // Stretch downward (falling)
        scaleX = 0.92
        scaleY = 1.08
      } else if (!p.jumping && state === 'running') {
        // Subtle bob while running
        scaleX = 1 + Math.sin(frame * 0.6) * 0.02
        scaleY = 1 - Math.sin(frame * 0.6) * 0.02
      }

      // Shadow on ground
      if (!p.jumping) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)'
        ctx.beginPath()
        ctx.ellipse(cx, GROUND_Y, 14, 4, 0, 0, Math.PI * 2)
        ctx.fill()
      } else {
        const airRatio = Math.min(1, Math.abs(py - (GROUND_Y - PLAYER_H)) / 120)
        ctx.fillStyle = `rgba(0,0,0,${0.06 * (1 - airRatio * 0.8)})`
        ctx.beginPath()
        ctx.ellipse(cx, GROUND_Y, 14 * (1 - airRatio * 0.4), 3 * (1 - airRatio * 0.6), 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // Glow when running
      if (state === 'running') {
        const glowGrad = ctx.createRadialGradient(cx, py + PLAYER_H / 2, 0, cx, py + PLAYER_H / 2, 28)
        glowGrad.addColorStop(0, hexToRgba(accent, 0.1))
        glowGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = glowGrad
        ctx.fillRect(px - 16, py - 16, PLAYER_W + 32, PLAYER_H + 32)
      }

      ctx.save()
      ctx.translate(cx, py + PLAYER_H)
      ctx.scale(scaleX, scaleY)
      ctx.translate(-cx, -(py + PLAYER_H))

      // ─ Character anatomy ─
      const headCY = py + 10
      const headR = 9
      const neckY = headCY + headR
      const shoulderY = neckY + 3
      const hipY = shoulderY + 16
      const kneeOffset = 10
      const footOffset = 12

      ctx.strokeStyle = fgColor
      ctx.lineWidth = 3.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Run cycle phase
      const runPhase = frame * 0.25

      if (state === 'running' && !p.jumping) {
        // ── RUNNING POSE ──
        const sin = Math.sin(runPhase)
        const cos = Math.cos(runPhase)

        // Back leg (draws first, behind body)
        const bHipX = cx - 2
        const bKneeX = bHipX - cos * 8
        const bKneeY = hipY + kneeOffset + Math.abs(cos) * 2
        const bFootX = bKneeX + sin * 5
        const bFootY = bKneeY + footOffset - Math.max(0, cos) * 6
        ctx.strokeStyle = hexToRgba(fgColor, 0.5)
        ctx.beginPath()
        ctx.moveTo(bHipX, hipY)
        ctx.lineTo(bKneeX, bKneeY)
        ctx.lineTo(bFootX, Math.min(bFootY, GROUND_Y))
        ctx.stroke()

        // Back arm
        const bArmX = cx - 1
        const bElbowX = bArmX + cos * 6
        const bElbowY = shoulderY + 8
        const bHandX = bElbowX + cos * 3
        const bHandY = bElbowY + 6
        ctx.strokeStyle = hexToRgba(fgColor, 0.4)
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(bArmX, shoulderY)
        ctx.lineTo(bElbowX, bElbowY)
        ctx.lineTo(bHandX, bHandY)
        ctx.stroke()
        ctx.lineWidth = 3.5

        // Torso
        ctx.fillStyle = fgColor
        roundedRect(ctx, cx - 8, shoulderY - 2, 16, hipY - shoulderY + 4, 4)
        ctx.fill()

        // Front leg
        const fHipX = cx + 2
        const fKneeX = fHipX + cos * 8
        const fKneeY = hipY + kneeOffset + Math.abs(sin) * 2
        const fFootX = fKneeX - sin * 5
        const fFootY = fKneeY + footOffset - Math.max(0, -cos) * 6
        ctx.strokeStyle = fgColor
        ctx.beginPath()
        ctx.moveTo(fHipX, hipY)
        ctx.lineTo(fKneeX, fKneeY)
        ctx.lineTo(fFootX, Math.min(fFootY, GROUND_Y))
        ctx.stroke()

        // Front arm
        const fArmX = cx + 1
        const fElbowX = fArmX - cos * 6
        const fElbowY = shoulderY + 8
        const fHandX = fElbowX - cos * 3
        const fHandY = fElbowY + 6
        ctx.strokeStyle = fgColor
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(fArmX, shoulderY)
        ctx.lineTo(fElbowX, fElbowY)
        ctx.lineTo(fHandX, fHandY)
        ctx.stroke()
        ctx.lineWidth = 3.5

      } else if (p.jumping) {
        // ── JUMP POSE ──
        // Torso
        ctx.fillStyle = fgColor
        roundedRect(ctx, cx - 8, shoulderY - 2, 16, hipY - shoulderY + 4, 4)
        ctx.fill()

        if (p.vy < -3) {
          // Ascending — legs tucked up
          ctx.strokeStyle = fgColor
          // Left leg: tucked back
          ctx.beginPath()
          ctx.moveTo(cx - 3, hipY)
          ctx.lineTo(cx - 8, hipY + 8)
          ctx.lineTo(cx - 4, hipY + 14)
          ctx.stroke()
          // Right leg: tucked forward
          ctx.beginPath()
          ctx.moveTo(cx + 3, hipY)
          ctx.lineTo(cx + 10, hipY + 6)
          ctx.lineTo(cx + 6, hipY + 14)
          ctx.stroke()
          // Arms up
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(cx - 6, shoulderY)
          ctx.lineTo(cx - 14, shoulderY - 6)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(cx + 6, shoulderY)
          ctx.lineTo(cx + 14, shoulderY - 6)
          ctx.stroke()
          ctx.lineWidth = 3.5
        } else if (p.vy > 3) {
          // Descending — legs extended down
          ctx.strokeStyle = fgColor
          ctx.beginPath()
          ctx.moveTo(cx - 3, hipY)
          ctx.lineTo(cx - 5, hipY + 10)
          ctx.lineTo(cx - 3, hipY + 20)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(cx + 3, hipY)
          ctx.lineTo(cx + 5, hipY + 10)
          ctx.lineTo(cx + 3, hipY + 20)
          ctx.stroke()
          // Arms back
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(cx - 6, shoulderY)
          ctx.lineTo(cx - 12, shoulderY + 6)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(cx + 6, shoulderY)
          ctx.lineTo(cx + 12, shoulderY + 6)
          ctx.stroke()
          ctx.lineWidth = 3.5
        } else {
          // Apex — spread out
          ctx.strokeStyle = fgColor
          ctx.beginPath()
          ctx.moveTo(cx - 3, hipY)
          ctx.lineTo(cx - 10, hipY + 6)
          ctx.lineTo(cx - 6, hipY + 16)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(cx + 3, hipY)
          ctx.lineTo(cx + 10, hipY + 6)
          ctx.lineTo(cx + 6, hipY + 16)
          ctx.stroke()
          // Arms out
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(cx - 6, shoulderY)
          ctx.lineTo(cx - 14, shoulderY)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(cx + 6, shoulderY)
          ctx.lineTo(cx + 14, shoulderY)
          ctx.stroke()
          ctx.lineWidth = 3.5
        }
      } else {
        // ── IDLE / STANDING POSE ──
        // Torso
        ctx.fillStyle = fgColor
        roundedRect(ctx, cx - 8, shoulderY - 2, 16, hipY - shoulderY + 4, 4)
        ctx.fill()

        // Standing legs — slightly apart
        ctx.strokeStyle = fgColor
        ctx.beginPath()
        ctx.moveTo(cx - 3, hipY)
        ctx.lineTo(cx - 5, hipY + 10)
        ctx.lineTo(cx - 4, GROUND_Y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cx + 3, hipY)
        ctx.lineTo(cx + 5, hipY + 10)
        ctx.lineTo(cx + 4, GROUND_Y)
        ctx.stroke()

        // Arms at rest
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(cx - 7, shoulderY)
        ctx.lineTo(cx - 10, shoulderY + 10)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cx + 7, shoulderY)
        ctx.lineTo(cx + 10, shoulderY + 10)
        ctx.stroke()
        ctx.lineWidth = 3.5
      }

      // ── Head (always on top) ──
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(cx, headCY, headR, 0, Math.PI * 2)
      ctx.fill()

      // Eye
      ctx.fillStyle = bgColor
      ctx.beginPath()
      ctx.arc(cx + 4, headCY - 1, 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = fgColor
      ctx.beginPath()
      ctx.arc(cx + 5, headCY - 1, 1, 0, Math.PI * 2)
      ctx.fill()

      // Scarf / cape trailing behind (visual flair)
      if (state === 'running') {
        const scarfWave = Math.sin(frame * 0.2) * 3
        ctx.strokeStyle = accent
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(cx - 4, neckY)
        ctx.quadraticCurveTo(cx - 18, neckY + 4 + scarfWave, cx - 24, neckY + 2 + scarfWave * 1.5)
        ctx.stroke()
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(cx - 4, neckY + 2)
        ctx.quadraticCurveTo(cx - 16, neckY + 8 + scarfWave * 0.7, cx - 20, neckY + 8 + scarfWave)
        ctx.stroke()
      }

      ctx.restore() // undo squash/stretch

      // ── Progress bar ──
      const progress = clearedRef.current.length / MILESTONES.length
      const barX = 24
      const barY = 16
      const barW = W - 48
      const barH = 6

      // Track
      ctx.fillStyle = hexToRgba(fgSubtle, 0.12)
      roundedRect(ctx, barX, barY, barW, barH, 3)
      ctx.fill()

      // Fill
      if (progress > 0) {
        const fillGrad = ctx.createLinearGradient(barX, 0, barX + barW * progress, 0)
        fillGrad.addColorStop(0, accent)
        fillGrad.addColorStop(1, hexToRgba(accent, 0.7))
        ctx.fillStyle = fillGrad
        roundedRect(ctx, barX, barY, barW * progress, barH, 3)
        ctx.fill()

        // Glow pip at end
        ctx.fillStyle = hexToRgba(accent, 0.4)
        ctx.beginPath()
        ctx.arc(barX + barW * progress, barY + barH / 2, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Progress text
      ctx.fillStyle = fgSubtle
      ctx.font = '500 10px Inter, system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(`${clearedRef.current.length} / ${MILESTONES.length} milestones`, barX, barY + barH + 14)

      // Next milestone name on right
      if (state === 'running' && nextMilestoneRef.current <= MILESTONES.length) {
        const nextIdx = Math.min(nextMilestoneRef.current, MILESTONES.length) - 1
        if (nextIdx >= 0 && nextIdx < MILESTONES.length) {
          const upcoming = blocks.find(b => !b.cleared && !b.falling)
          if (upcoming) {
            ctx.textAlign = 'right'
            ctx.font = '500 10px Inter, system-ui, sans-serif'
            ctx.fillStyle = upcoming.milestone.color
            ctx.fillText(`Next: ${upcoming.milestone.company}`, W - barX, barY + barH + 14)
          }
        }
      }

      // ── Screen flash overlay ──
      if (screenFlashRef.current > 0) {
        ctx.fillStyle = hexToRgba(accent, screenFlashRef.current * 0.15)
        ctx.fillRect(-10, -10, W + 20, H + 20)
        screenFlashRef.current *= 0.9
        if (screenFlashRef.current < 0.01) screenFlashRef.current = 0
      }

      // ── Idle screen ──
      if (state === 'idle') {
        // Subtle backdrop
        ctx.fillStyle = hexToRgba(bgColor, 0.6)
        ctx.fillRect(0, 0, W, H)

        // Animated dots around title
        const t = frameRef.current * 0.02
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8 + t
          const dotX = W / 2 + Math.cos(a) * 120
          const dotY = H / 2 + Math.sin(a) * 40
          ctx.fillStyle = hexToRgba(accent, 0.15 + Math.sin(t + i) * 0.1)
          ctx.beginPath()
          ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = fgColor
        ctx.font = '600 26px "Playfair Display", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Run Through My Resume', W / 2, H / 2 - 36)

        ctx.font = '14px Inter, system-ui, sans-serif'
        ctx.fillStyle = fgSubtle
        ctx.fillText('Jump over each milestone to build my career story below', W / 2, H / 2 - 4)

        // Pulsing CTA
        const pulse = 0.85 + Math.sin(frameRef.current * 0.06) * 0.15
        ctx.globalAlpha = pulse
        ctx.font = '600 15px Inter, system-ui, sans-serif'
        ctx.fillStyle = accent
        ctx.fillText('Press Space or Tap to Start', W / 2, H / 2 + 32)
        ctx.globalAlpha = 1

        // Small hint
        ctx.font = '11px Inter, system-ui, sans-serif'
        ctx.fillStyle = hexToRgba(fgSubtle, 0.6)
        ctx.fillText('Double-tap for double jump', W / 2, H / 2 + 56)
      }

      // ── Dead screen ──
      if (state === 'dead') {
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fillRect(-10, -10, W + 20, H + 20)

        ctx.fillStyle = '#FFFFFF'
        ctx.font = '600 26px "Playfair Display", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Career Interrupted!', W / 2, H / 2 - 24)

        ctx.font = '14px Inter, system-ui, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.fillText(`Cleared ${clearedRef.current.length} of ${MILESTONES.length} milestones`, W / 2, H / 2 + 6)

        const pulse = 0.8 + Math.sin(frameRef.current * 0.06) * 0.2
        ctx.globalAlpha = pulse
        ctx.font = '600 14px Inter, system-ui, sans-serif'
        ctx.fillStyle = accent
        ctx.fillText('Tap or Press Space to Try Again', W / 2, H / 2 + 36)
        ctx.globalAlpha = 1
      }

      // ── Win screen ──
      if (state === 'complete') {
        // Gradient overlay
        const winGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2)
        winGrad.addColorStop(0, hexToRgba(accent, 0.15))
        winGrad.addColorStop(1, hexToRgba(bgColor, 0.8))
        ctx.fillStyle = winGrad
        ctx.fillRect(-10, -10, W + 20, H + 20)

        ctx.fillStyle = accent
        ctx.font = '600 28px "Playfair Display", Georgia, serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Resume Complete!', W / 2, H / 2 - 14)

        ctx.font = '14px Inter, system-ui, sans-serif'
        ctx.fillStyle = fgSubtle
        ctx.fillText('Scroll down to see the full picture', W / 2, H / 2 + 18)
      }

      ctx.restore() // undo shake transform
    }

    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [spawnNext, spawnBurst, spawnDust, spawnTrail])

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
        className="overflow-hidden rounded-xl border-2 shadow-lg"
        style={{ borderColor: 'var(--border)' }}
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

      {/* Hints */}
      <p className="mt-2 text-center text-[11px] sm:hidden" style={{ color: 'var(--fg-subtle)' }}>
        Tap to jump · Double tap for double jump
      </p>
      <p className="mt-2 hidden text-center text-[11px] sm:block" style={{ color: 'var(--fg-subtle)' }}>
        Space or ↑ to jump · Press twice for double jump
      </p>

      {/* Cleared milestones — builds up as you play */}
      {clearedMilestones.length > 0 && (
        <div className="mt-8">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--accent)' }}
          >
            {showFullResume ? 'The full picture' : 'Building the resume…'}
          </p>
          <div className="space-y-0">
            {clearedMilestones.map((m, i) => (
              <div
                key={m.year}
                className="flex items-start gap-4 border-l-2 py-3.5 pl-5"
                style={{
                  borderColor: m.color,
                  animation: `fadeUp 0.4s ease-out ${i * 0.05}s both`,
                }}
              >
                {/* Logo badge - white bg with colored border for full-color logo visibility */}
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 bg-white shadow-sm"
                  style={{ borderColor: m.color }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={LOGO_PATHS[m.logoKey]}
                    alt={`${m.company} logo`}
                    className="h-7 w-7"
                  />
                </div>
                <div className="w-[4.5rem] shrink-0 pt-1">
                  <p className="text-xs font-bold" style={{ color: m.color }}>
                    {m.year}
                  </p>
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                    {m.title}
                  </p>
                  <p className="text-xs font-medium" style={{ color: 'var(--fg-subtle)' }}>
                    {m.company}
                  </p>
                  {showFullResume && (
                    <p
                      className="mt-1.5 text-xs leading-relaxed"
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
              className="mt-8 rounded-xl border-2 p-6 text-center"
              style={{
                borderColor: 'var(--accent)',
                background: 'var(--accent-light)',
                animation: 'fadeUp 0.5s ease-out 0.3s both',
              }}
            >
              <p className="mb-1 text-base font-semibold" style={{ color: 'var(--accent)' }}>
                You made it through my entire career!
              </p>
              <p className="mb-5 text-sm" style={{ color: 'var(--fg-muted)' }}>
                Now that you know my background, let&apos;s connect.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="mailto:hello@jake-chen.com" className="btn-primary text-sm">
                  Say hello
                </a>
                <a
                  href="https://linkedin.com/in/jiakechen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-sm"
                >
                  LinkedIn
                </a>
                <a href="/writing" className="btn-ghost text-sm">
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
