'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CANVAS_W = 800
const CANVAS_H = 300
const GROUND_Y = 240
const AGENT_W = 30
const AGENT_H = 40

type Difficulty = 'chill' | 'normal' | 'chaos'

const DIFFICULTY_SETTINGS: Record<Difficulty, {
  gravity: number
  jumpForce: number
  baseSpeed: number
  speedIncrement: number
  spawnBase: number
  label: string
  desc: string
  doubleJumpForce: number
}> = {
  chill: {
    gravity: 0.55,
    jumpForce: -12,
    doubleJumpForce: -10,
    baseSpeed: 3,
    speedIncrement: 0.0004,
    spawnBase: 140,
    label: 'Chill Mode',
    desc: 'Slower speed, wider gaps. Good for vibes.',
  },
  normal: {
    gravity: 0.7,
    jumpForce: -13,
    doubleJumpForce: -11,
    baseSpeed: 4,
    speedIncrement: 0.001,
    spawnBase: 100,
    label: 'Normal',
    desc: 'The standard run. Things get fast.',
  },
  chaos: {
    gravity: 0.8,
    jumpForce: -14,
    doubleJumpForce: -12,
    baseSpeed: 5.5,
    speedIncrement: 0.002,
    spawnBase: 70,
    label: 'Chaos Mode',
    desc: 'Faster. Tighter. Good luck.',
  },
}

interface Obstacle {
  x: number
  w: number
  h: number
  y: number // top of obstacle (for flying obstacles)
  type: 'bug' | 'firewall' | 'latency' | 'hallucination' | 'cloud' | 'overfit' | 'leak'
  label: string
  flying: boolean
}

// Fun obstacle labels — rotates through these for variety
const GROUND_OBSTACLE_POOL: { type: Obstacle['type']; labels: string[] }[] = [
  { type: 'bug', labels: ['OFF-BY-ONE', 'RACE COND.', 'NULL PTR', 'SEG FAULT', 'MEM LEAK', 'TYPE ERR'] },
  { type: 'firewall', labels: ['CORP PROXY', 'RATE LIMIT', 'AUTH WALL', '403', 'BLOCKED'] },
  { type: 'latency', labels: ['999ms', 'TIMEOUT', 'COLD START', 'BUFFERING', 'RETRY #47'] },
  { type: 'hallucination', labels: ['MADE UP', 'SO WRONG', 'FAKE REF', '"ACTUALLY"', 'TRUST ME'] },
]

const FLYING_OBSTACLE_POOL: { type: Obstacle['type']; labels: string[] }[] = [
  { type: 'cloud', labels: ['VAPORWARE', 'BUZZWORD', '"AI-NATIVE"', 'GPT WRAPPER', 'HYPE CLOUD'] },
  { type: 'overfit', labels: ['OVERFIT', 'MEMO LEAK', 'TRAIN BLEED', 'CHERRY PICK'] },
  { type: 'leak', labels: ['PII LEAK', 'DATA SPILL', 'INJECT', 'EXFIL'] },
]

// Witty death messages per obstacle type
const DEATH_MESSAGES: Record<Obstacle['type'], string[]> = {
  bug: [
    'Classic. The bug was in production the whole time.',
    'Should\'ve written tests. Just kidding, nobody does.',
    'The bug found you before you found it.',
    '"It works on my machine" — famous last words.',
  ],
  firewall: [
    'Blocked by corporate IT. As is tradition.',
    'Your request has been forwarded to /dev/null.',
    'Access denied. Have you tried being an admin?',
    'The firewall won. They always do.',
  ],
  latency: [
    'Connection timed out. The server is "thinking."',
    'Still waiting for that API response from 2024.',
    'Latency: the silent killer of user trust.',
    'Your p99 just became your p100.',
  ],
  hallucination: [
    'The model was very confident about that wrong answer.',
    'Cited three papers. None of them exist.',
    '"According to my training data..." — narrator: it wasn\'t.',
    'Hallucinated with conviction. Respect.',
  ],
  cloud: [
    'Disrupted by a cloud that disrupts disruption.',
    'It was AI-powered. What it powered remains unclear.',
    'Another GPT wrapper ascends to the clouds.',
    'The buzzword density was simply too high.',
  ],
  overfit: [
    'Memorized the training set. Surprised by reality.',
    'Works perfectly on the benchmark. Nowhere else.',
    '99.9% accuracy*  (*on the test set it was trained on)',
    'Your model peaked in training. Like a child actor.',
  ],
  leak: [
    'Your training data is showing.',
    'Congrats, you just leaked PII to the whole internet.',
    'The prompt injection worked. You played yourself.',
    'Data governance? Never heard of her.',
  ],
}

// BondKnows brand orange
const BK_ORANGE = '#F58220'
const BK_ORANGE_LIGHT = '#FFB366'
const BK_ORANGE_DARK = '#D96A0B'

// Draw the agent — WIREFRAME HOLOGRAM style
function drawAgent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  h: number,
  opts: {
    isDucking: boolean
    isJumping: boolean
    jumpCount: number
    legFrame: number
    frameCount: number
    isBoosted: boolean
    doubleJumpTrail: number
    bgColor: string
    isDark: boolean
  }
) {
  const cx = x + AGENT_W / 2
  const { isDucking, isJumping, legFrame, frameCount, isBoosted, doubleJumpTrail } = opts

  // Colors
  const mainColor = doubleJumpTrail > 0 ? BK_ORANGE_LIGHT : (isBoosted ? '#22D3EE' : BK_ORANGE)
  const glowColor = doubleJumpTrail > 0 ? 'rgba(255,179,102,0.6)' : (isBoosted ? 'rgba(34,211,238,0.6)' : 'rgba(245,130,32,0.6)')
  const darkFill = doubleJumpTrail > 0 ? '#3D2200' : (isBoosted ? '#0B3D47' : '#2A1000')

  ctx.save()

  if (isDucking) {
    // ── DUCKING — flat pill with JC ──
    const dw = AGENT_W + 12
    const dh = h * 0.45
    const dx = x - 6
    const dy = y + h - dh

    // Glow
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 16

    // Pill body
    ctx.fillStyle = darkFill
    ctx.beginPath()
    ctx.roundRect(dx, dy, dw, dh, dh / 2)
    ctx.fill()

    // Pill border
    ctx.strokeStyle = mainColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(dx, dy, dw, dh, dh / 2)
    ctx.stroke()

    // "JC" text
    ctx.shadowBlur = 8
    ctx.fillStyle = mainColor
    ctx.font = 'bold 11px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('JC', dx + dw / 2, dy + dh / 2 + 1)

    // Speed streaks behind
    ctx.shadowBlur = 0
    ctx.strokeStyle = mainColor
    ctx.globalAlpha = 0.3
    ctx.lineWidth = 1.5
    for (let i = 0; i < 3; i++) {
      const sy = dy + dh * 0.2 + i * (dh * 0.3)
      const sLen = 8 + i * 4 + Math.sin(frameCount * 0.2 + i) * 3
      ctx.beginPath()
      ctx.moveTo(dx - 2, sy)
      ctx.lineTo(dx - 2 - sLen, sy)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  } else {
    // ── STANDING / JUMPING — JC monogram badge ──
    const tilt = isJumping ? (opts.jumpCount >= 2 ? -0.12 : -0.06) : 0
    const bounce = !isJumping ? Math.sin(legFrame * 0.3) * 1.5 : 0

    ctx.save()
    ctx.translate(cx, y + h)
    ctx.rotate(tilt)
    ctx.translate(-cx, -(y + h))

    const badgeX = x - 2
    const badgeY = y + bounce
    const badgeW = AGENT_W + 4
    const badgeH = h - 4
    const borderR = 8

    // Outer glow
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 20

    // Badge body — dark fill
    ctx.fillStyle = darkFill
    ctx.beginPath()
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, borderR)
    ctx.fill()

    // Badge border — bright orange
    ctx.strokeStyle = mainColor
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, borderR)
    ctx.stroke()

    // Inner glow line (subtle second border)
    ctx.shadowBlur = 0
    ctx.strokeStyle = mainColor
    ctx.globalAlpha = 0.15
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(badgeX + 3, badgeY + 3, badgeW - 6, badgeH - 6, borderR - 2)
    ctx.stroke()
    ctx.globalAlpha = 1

    // "JC" monogram — big, bold, centered
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 12
    ctx.fillStyle = mainColor
    ctx.font = 'bold 18px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('JC', badgeX + badgeW / 2, badgeY + badgeH * 0.45)

    // Subtitle — tiny "run" text
    ctx.shadowBlur = 4
    ctx.fillStyle = mainColor
    ctx.globalAlpha = 0.5
    ctx.font = '7px monospace'
    ctx.fillText('run', badgeX + badgeW / 2, badgeY + badgeH * 0.75)
    ctx.globalAlpha = 1

    // Pulsing energy dot at top center
    const dotPulse = 2 + Math.sin(frameCount * 0.15) * 0.8
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 10
    ctx.fillStyle = '#FFFFFF'
    ctx.globalAlpha = 0.7 + Math.sin(frameCount * 0.15) * 0.2
    ctx.beginPath()
    ctx.arc(badgeX + badgeW / 2, badgeY + 2, dotPulse, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    // Running legs — two small animated lines below the badge
    if (!isJumping) {
      const legBase = badgeY + badgeH
      const legPhase = Math.sin(legFrame * 0.3)
      ctx.shadowBlur = 6
      ctx.strokeStyle = mainColor
      ctx.lineWidth = 2
      ctx.lineCap = 'round'

      // Left leg
      ctx.beginPath()
      ctx.moveTo(cx - 5, legBase)
      ctx.lineTo(cx - 5 + legPhase * 4, legBase + 4)
      ctx.stroke()
      // Right leg
      ctx.beginPath()
      ctx.moveTo(cx + 5, legBase)
      ctx.lineTo(cx + 5 - legPhase * 4, legBase + 4)
      ctx.stroke()
    }

    // Scanline sweep across badge
    const scanPhase = ((frameCount * 1.5) % (badgeH + 10)) - 5
    const scanLineY = badgeY + scanPhase
    if (scanLineY > badgeY && scanLineY < badgeY + badgeH) {
      ctx.shadowBlur = 0
      ctx.strokeStyle = '#FFFFFF'
      ctx.globalAlpha = 0.08
      ctx.lineWidth = badgeW - 8
      ctx.beginPath()
      ctx.moveTo(badgeX + badgeW / 2, scanLineY)
      ctx.lineTo(badgeX + badgeW / 2, scanLineY)
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    ctx.restore() // undo tilt
  }

  ctx.restore()

  // === DOUBLE JUMP READY — spinning dashed ring ===
  if (opts.jumpCount === 1 && isJumping) {
    const ringR = AGENT_W * 0.7
    const ringAlpha = 0.3 + Math.sin(frameCount * 0.25) * 0.15
    ctx.save()
    ctx.globalAlpha = ringAlpha
    ctx.strokeStyle = mainColor
    ctx.lineWidth = 1.2
    ctx.setLineDash([4, 4])
    ctx.translate(cx, y + h / 2)
    ctx.rotate(frameCount * 0.04)
    ctx.translate(-cx, -(y + h / 2))
    ctx.beginPath()
    ctx.arc(cx, y + h / 2, ringR, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.restore()
  }
}

// Visual progression stages
function getStage(distance: number): number {
  if (distance < 500) return 0
  if (distance < 1500) return 1
  if (distance < 3000) return 2
  if (distance < 5000) return 3
  return 4
}

function stageColors(stage: number, isDark: boolean) {
  // Background tints get more intense with progression
  const tints = isDark
    ? ['#09090B', '#0A0A10', '#0B0915', '#0D071A', '#10051F']
    : ['#FAFAF8', '#F5F5F0', '#F0F0EC', '#EBE8E5', '#E5E0DD']
  const gridAlphas = [0.03, 0.045, 0.06, 0.08, 0.1]
  const gridSpacings = [60, 50, 40, 32, 24]
  const accentShifts = isDark
    ? ['#F58220', '#F89040', '#FAAA60', '#FCC080', '#FFD8A0']
    : ['#D96A0B', '#E07300', '#E87C00', '#F08500', '#F58220']
  return {
    bg: tints[stage],
    gridAlpha: gridAlphas[stage],
    gridSpacing: gridSpacings[stage],
    accent: accentShifts[stage],
  }
}

export default function AIRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<'idle' | 'running' | 'dead'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [boostActive, setBoostActive] = useState(false)
  const [killedBy, setKilledBy] = useState<{ type: Obstacle['type']; label: string; message: string } | null>(null)
  const boostRef = useRef(false)

  const gameRef = useRef({
    agentY: GROUND_Y - AGENT_H,
    agentVY: 0,
    isJumping: false,
    jumpCount: 0, // 0 = grounded, 1 = single jump, 2 = double jumped
    isDucking: false,
    obstacles: [] as Obstacle[],
    speed: 4,
    distance: 0,
    frameCount: 0,
    legFrame: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string; size?: number; shape?: 'circle' | 'square' | 'diamond' }[],
    boostTimer: 0,
    shakeTimer: 0,
    shakeIntensity: 0,
    combo: 0,
    comboTimer: 0,
    comboScale: 0,
    lastMilestone: 0,
    milestoneFlash: 0,
    milestoneScale: 0,
    speedLines: [] as { x: number; y: number; len: number; alpha: number }[],
    nearMissFlash: 0,
    doubleJumpTrail: 0,
    ambientDots: [] as { x: number; y: number; speed: number; alpha: number; r: number }[],
    groundTicks: 0,
  })

  const settingsRef = useRef(DIFFICULTY_SETTINGS.normal)

  const spawnObstacle = useCallback(() => {
    const g = gameRef.current
    const stage = getStage(g.distance)

    // Flying obstacles start appearing at stage 1+
    const canFly = stage >= 1 && g.distance > 800
    const flyChance = canFly ? Math.min(0.15 + stage * 0.08, 0.45) : 0
    const isFlying = Math.random() < flyChance

    if (isFlying) {
      const pool = FLYING_OBSTACLE_POOL[Math.floor(Math.random() * FLYING_OBSTACLE_POOL.length)]
      const label = pool.labels[Math.floor(Math.random() * pool.labels.length)]
      const w = 50 + Math.random() * 30
      const h = 20 + Math.random() * 15
      const flyY = GROUND_Y - AGENT_H - 45 - Math.random() * 35
      g.obstacles.push({
        x: CANVAS_W + 50,
        w,
        h,
        y: flyY,
        type: pool.type,
        label,
        flying: true,
      })
    } else {
      const pool = GROUND_OBSTACLE_POOL[Math.floor(Math.random() * GROUND_OBSTACLE_POOL.length)]
      const label = pool.labels[Math.floor(Math.random() * pool.labels.length)]
      const h = 25 + Math.random() * 35
      const w = 22 + Math.random() * 18
      g.obstacles.push({
        x: CANVAS_W + 50,
        w,
        h,
        y: GROUND_Y - h,
        type: pool.type,
        label,
        flying: false,
      })
    }
  }, [])

  const jump = useCallback(() => {
    const g = gameRef.current
    const s = settingsRef.current

    if (g.isDucking) return // can't jump while ducking

    if (g.jumpCount === 0) {
      // First jump
      g.agentVY = s.jumpForce
      g.isJumping = true
      g.jumpCount = 1
    } else if (g.jumpCount === 1) {
      // Double jump — slightly weaker, with visual burst
      g.agentVY = s.doubleJumpForce
      g.jumpCount = 2
      g.doubleJumpTrail = 12 // frames of trail effect

      // Double jump burst particles — ring explosion
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12
        g.particles.push({
          x: 50 + AGENT_W / 2,
          y: g.agentY + AGENT_H / 2,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          life: 0.6,
          color: i % 2 === 0 ? BK_ORANGE : BK_ORANGE_LIGHT,
          size: 2 + Math.random() * 2,
          shape: 'diamond',
        })
      }
    }
  }, [])

  const duck = useCallback((active: boolean) => {
    const g = gameRef.current
    if (active && !g.isJumping) {
      g.isDucking = true
    } else {
      g.isDucking = false
    }
  }, [])

  const activateBoost = useCallback(() => {
    const g = gameRef.current
    if (g.boostTimer <= 0) {
      g.boostTimer = 180
      boostRef.current = true
      setBoostActive(true)
    }
  }, [])

  const startGame = useCallback(() => {
    const s = DIFFICULTY_SETTINGS[difficulty]
    settingsRef.current = s
    const g = gameRef.current
    g.agentY = GROUND_Y - AGENT_H
    g.agentVY = 0
    g.isJumping = false
    g.jumpCount = 0
    g.isDucking = false
    g.obstacles = []
    g.speed = s.baseSpeed
    g.distance = 0
    g.frameCount = 0
    g.legFrame = 0
    g.particles = []
    g.boostTimer = 0
    g.shakeTimer = 0
    g.shakeIntensity = 0
    g.combo = 0
    g.comboTimer = 0
    g.lastMilestone = 0
    g.milestoneFlash = 0
    g.speedLines = []
    g.nearMissFlash = 0
    g.doubleJumpTrail = 0
    g.comboScale = 0
    g.milestoneScale = 0
    g.groundTicks = 0
    // Seed ambient floating dots
    g.ambientDots = []
    for (let i = 0; i < 15; i++) {
      g.ambientDots.push({
        x: Math.random() * CANVAS_W,
        y: 20 + Math.random() * (GROUND_Y - 40),
        speed: 0.2 + Math.random() * 0.5,
        alpha: 0.03 + Math.random() * 0.06,
        r: 1 + Math.random() * 2,
      })
    }
    boostRef.current = false
    setBoostActive(false)
    setKilledBy(null)
    setScore(0)
    setGameState('running')
  }, [difficulty])

  // Input handling
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (gameState === 'idle' || gameState === 'dead') {
          startGame()
        } else if (gameState === 'running') {
          jump()
        }
      }
      if (e.code === 'ArrowDown' && gameState === 'running') {
        e.preventDefault()
        duck(true)
      }
      if (e.code === 'KeyB' && gameState === 'running') {
        activateBoost()
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.code === 'ArrowDown') {
        duck(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState, startGame, jump, activateBoost, duck])

  // Touch handling
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    function handleTouch(e: TouchEvent) {
      e.preventDefault()
      if (gameState === 'idle' || gameState === 'dead') {
        startGame()
      } else if (gameState === 'running') {
        jump()
      }
    }
    el.addEventListener('touchstart', handleTouch, { passive: false })
    return () => el.removeEventListener('touchstart', handleTouch)
  }, [gameState, startGame, jump])

  // Game loop
  useEffect(() => {
    if (gameState !== 'running') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const s = settingsRef.current

    function loop() {
      const g = gameRef.current
      g.frameCount++
      g.legFrame++

      // Boost timer
      if (g.boostTimer > 0) {
        g.boostTimer--
        if (g.boostTimer <= 0) {
          boostRef.current = false
          setBoostActive(false)
        }
      }
      const isBoosted = boostRef.current

      // Double jump trail decay
      if (g.doubleJumpTrail > 0) g.doubleJumpTrail--

      // Physics
      const grav = isBoosted ? s.gravity * 0.6 : s.gravity
      // If ducking mid-air, fall faster (slam down)
      const effectiveGrav = g.isDucking && g.isJumping ? grav * 2.5 : grav
      g.agentVY += effectiveGrav
      g.agentY += g.agentVY

      if (g.agentY >= GROUND_Y - (g.isDucking ? AGENT_H * 0.6 : AGENT_H)) {
        g.agentY = GROUND_Y - (g.isDucking ? AGENT_H * 0.6 : AGENT_H)
        g.agentVY = 0
        g.isJumping = false
        g.jumpCount = 0
      }

      // Speed
      g.speed += s.speedIncrement
      const effectiveSpeed = isBoosted ? g.speed * 0.65 : g.speed
      g.distance += effectiveSpeed

      // Milestones every 500 distance points
      const currentScore = Math.floor(g.distance / 10)
      const milestone = Math.floor(currentScore / 500)
      if (milestone > g.lastMilestone && currentScore > 0) {
        g.lastMilestone = milestone
        g.milestoneFlash = 50
        g.milestoneScale = 1.8 // starts big, shrinks to 1
        // Celebration particles — mixed shapes
        const shapes: Array<'circle' | 'square' | 'diamond'> = ['circle', 'square', 'diamond']
        for (let i = 0; i < 30; i++) {
          g.particles.push({
            x: CANVAS_W / 2 + (Math.random() - 0.5) * 300,
            y: 30 + Math.random() * 60,
            vx: (Math.random() - 0.5) * 5,
            vy: Math.random() * 3 + 0.5,
            life: 1,
            color: [BK_ORANGE, BK_ORANGE_LIGHT, '#22D3EE', '#10B981', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 6)],
            size: 2 + Math.random() * 4,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
          })
        }
      }
      if (g.milestoneFlash > 0) g.milestoneFlash--
      if (g.milestoneScale > 1) g.milestoneScale += (1 - g.milestoneScale) * 0.12
      if (g.comboScale > 1) g.comboScale += (1 - g.comboScale) * 0.15

      // Ambient floating dots
      g.ambientDots.forEach(d => {
        d.x -= d.speed * effectiveSpeed * 0.3
        d.y += Math.sin(g.frameCount * 0.01 + d.x * 0.01) * 0.15
        if (d.x < -10) { d.x = CANVAS_W + 10; d.y = 20 + Math.random() * (GROUND_Y - 40) }
      })
      g.groundTicks += effectiveSpeed

      // Speed lines at higher stages
      const stage = getStage(g.distance)
      if (stage >= 2 && g.frameCount % (6 - stage) === 0) {
        g.speedLines.push({
          x: CANVAS_W,
          y: 30 + Math.random() * (GROUND_Y - 60),
          len: 20 + Math.random() * 40 + stage * 10,
          alpha: 0.15 + stage * 0.05,
        })
      }
      g.speedLines.forEach(sl => { sl.x -= effectiveSpeed * 2.5 })
      g.speedLines = g.speedLines.filter(sl => sl.x + sl.len > 0)

      // Spawn
      const spawnRate = Math.max(45, s.spawnBase - Math.floor(g.distance / 500))
      if (g.frameCount % spawnRate === 0) {
        spawnObstacle()
      }

      // Move obstacles
      g.obstacles.forEach((o) => (o.x -= effectiveSpeed))
      g.obstacles = g.obstacles.filter((o) => o.x + o.w > -50)

      // Particles
      g.particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life -= 0.03 })
      g.particles = g.particles.filter((p) => p.life > 0)

      // Combo timer
      if (g.comboTimer > 0) {
        g.comboTimer--
        if (g.comboTimer <= 0) g.combo = 0
      }
      if (g.nearMissFlash > 0) g.nearMissFlash--

      // Trail — richer particles
      if (g.frameCount % 2 === 0) {
        const trailColor = g.doubleJumpTrail > 0 ? BK_ORANGE_LIGHT : (isBoosted ? '#22D3EE' : BK_ORANGE)
        g.particles.push({
          x: 50 + Math.random() * 5,
          y: g.agentY + AGENT_H / 2 + (Math.random() - 0.5) * 12,
          vx: -1.5 - Math.random() * 1.5,
          vy: (Math.random() - 0.5) * 0.8,
          life: 0.5 + Math.random() * 0.4,
          color: trailColor,
          size: 1.5 + Math.random() * 2,
          shape: 'circle',
        })
      }

      // Collision & near-miss detection
      const duckH = g.isDucking ? AGENT_H * 0.5 : AGENT_H
      const duckY = g.isDucking ? GROUND_Y - AGENT_H * 0.6 + 8 : g.agentY
      const hitPad = isBoosted ? 8 : 4
      const agentBox = { x: 50 + hitPad, y: duckY + hitPad, w: AGENT_W - hitPad * 2, h: duckH - hitPad * 2 }

      let died = false
      for (const o of g.obstacles) {
        const obsBox = { x: o.x, y: o.y, w: o.w, h: o.h }
        if (
          agentBox.x < obsBox.x + obsBox.w &&
          agentBox.x + agentBox.w > obsBox.x &&
          agentBox.y < obsBox.y + obsBox.h &&
          agentBox.y + agentBox.h > obsBox.y
        ) {
          // Death — wireframe fragment explosion
          // Orange wireframe shards + red sparks
          for (let i = 0; i < 25; i++) {
            const angle = (Math.PI * 2 * i) / 25
            const speed = 3 + Math.random() * 5
            g.particles.push({
              x: 50 + AGENT_W / 2, y: g.agentY + AGENT_H / 2,
              vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
              vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 2,
              life: 0.8 + Math.random() * 0.4,
              color: i % 3 === 0 ? '#EF4444' : (i % 3 === 1 ? BK_ORANGE : BK_ORANGE_LIGHT),
              size: 1.5 + Math.random() * 2.5,
              shape: i % 2 === 0 ? 'diamond' : 'square', // angular = wireframe fragments
            })
          }
          // Extra bright white sparks from the core
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8
            g.particles.push({
              x: 50 + AGENT_W / 2, y: g.agentY + AGENT_H * 0.4,
              vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4 - 1,
              life: 0.5, color: '#FFFFFF', size: 2, shape: 'circle',
            })
          }
          g.shakeTimer = 18
          g.shakeIntensity = 10
          const finalScore = Math.floor(g.distance / 10)
          // Pick a witty death message for this obstacle type
          const messages = DEATH_MESSAGES[o.type] || DEATH_MESSAGES.bug
          const deathMsg = messages[Math.floor(Math.random() * messages.length)]
          setKilledBy({ type: o.type, label: o.label, message: deathMsg })
          setScore(finalScore)
          setHighScore((prev) => Math.max(prev, finalScore))
          setGameState('dead')
          // Dispatch event for GameWrapper
          window.dispatchEvent(new CustomEvent('game-over', {
            detail: { score: finalScore, boostsUsed: 0 },
          }))
          died = true
          break
        }

        // Near-miss detection (within 15px horizontally, not colliding)
        const nearDist = 15
        if (
          !died &&
          o.x > 50 - nearDist && o.x < 50 + AGENT_W + nearDist &&
          !(agentBox.x < obsBox.x + obsBox.w &&
            agentBox.x + agentBox.w > obsBox.x &&
            agentBox.y < obsBox.y + obsBox.h &&
            agentBox.y + agentBox.h > obsBox.y)
        ) {
          // Check we haven't already counted this obstacle
          if (!(o as Obstacle & { counted?: boolean }).counted) {
            (o as Obstacle & { counted?: boolean }).counted = true
            g.combo++
            g.comboTimer = 120
            g.comboScale = 1.5 // bounce effect
            g.nearMissFlash = 15

            // Near-miss sparkle — circles + diamonds
            for (let i = 0; i < 8; i++) {
              g.particles.push({
                x: 50 + AGENT_W / 2 + (Math.random() - 0.5) * 24,
                y: g.agentY + (Math.random()) * AGENT_H,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 0.7,
                color: i % 2 === 0 ? '#10B981' : '#34D399',
                size: 2 + Math.random() * 2,
                shape: i % 3 === 0 ? 'diamond' : 'circle',
              })
            }
          }
        }
      }

      if (died) return

      setScore(Math.floor(g.distance / 10))

      // ── DRAW ──
      if (!ctx) return
      const isDark = document.documentElement.classList.contains('dark')
      const sc = stageColors(stage, isDark)

      const fgColor = isDark ? '#FAFAFA' : '#1A1A2E'
      const mutedColor = isDark ? '#71717A' : '#8E8E9A'
      const accentColor = sc.accent
      const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,46,0.1)'

      // Screen shake offset
      let shakeX = 0, shakeY = 0
      if (g.shakeTimer > 0) {
        g.shakeTimer--
        const intensity = g.shakeIntensity * (g.shakeTimer / 15)
        shakeX = (Math.random() - 0.5) * intensity
        shakeY = (Math.random() - 0.5) * intensity
      }

      ctx.save()
      ctx.translate(shakeX, shakeY)

      // Background with stage progression
      ctx.fillStyle = sc.bg
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Milestone flash — orange pulse
      if (g.milestoneFlash > 0) {
        const flashAlpha = (g.milestoneFlash / 50) * 0.1
        ctx.fillStyle = `rgba(245, 130, 32, ${flashAlpha})`
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      }

      // Near-miss green flash
      if (g.nearMissFlash > 0) {
        const nmAlpha = (g.nearMissFlash / 15) * 0.07
        ctx.fillStyle = `rgba(16, 185, 129, ${nmAlpha})`
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      }

      // Boost tint
      if (isBoosted) {
        ctx.fillStyle = isDark ? 'rgba(34, 211, 238, 0.04)' : 'rgba(6, 182, 212, 0.05)'
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      }

      // Progressive grid — horizontal
      const gridAlpha = sc.gridAlpha
      ctx.strokeStyle = isDark ? `rgba(255,255,255,${gridAlpha})` : `rgba(0,0,0,${gridAlpha})`
      ctx.lineWidth = 0.5
      const spacing = sc.gridSpacing
      for (let gy = spacing; gy < GROUND_Y; gy += spacing) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(CANVAS_W, gy); ctx.stroke()
      }
      // Vertical grid (stage 2+) — scrolling parallax
      if (stage >= 2) {
        const vOffset = g.groundTicks % spacing
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${gridAlpha * 0.5})` : `rgba(0,0,0,${gridAlpha * 0.5})`
        for (let gx = -vOffset; gx < CANVAS_W; gx += spacing) {
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, GROUND_Y); ctx.stroke()
        }
      }

      // Ambient floating dots
      g.ambientDots.forEach(d => {
        ctx.globalAlpha = d.alpha
        ctx.fillStyle = isDark ? '#FFFFFF' : accentColor
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // Speed lines — with glow
      g.speedLines.forEach(sl => {
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${sl.alpha})` : `rgba(0,0,0,${sl.alpha * 0.6})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(sl.x, sl.y)
        ctx.lineTo(sl.x + sl.len, sl.y)
        ctx.stroke()
      })
      ctx.lineWidth = 1

      // ═══ GROUND LINE — glowing ═══
      // Glow layer
      ctx.save()
      ctx.shadowColor = isDark ? 'rgba(245, 130, 32, 0.3)' : 'rgba(217, 106, 11, 0.2)'
      ctx.shadowBlur = 6
      ctx.strokeStyle = isDark ? 'rgba(245, 130, 32, 0.25)' : 'rgba(217, 106, 11, 0.15)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke()
      ctx.restore()
      // Crisp line on top
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke()

      // Scrolling ground tick marks
      const tickSpacing = 40
      const tickOffset = g.groundTicks % tickSpacing
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
      ctx.lineWidth = 1
      for (let tx = -tickOffset; tx < CANVAS_W; tx += tickSpacing) {
        ctx.beginPath(); ctx.moveTo(tx, GROUND_Y); ctx.lineTo(tx, GROUND_Y + 8); ctx.stroke()
      }

      // Sub-ground fade
      const subGrad = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_H)
      subGrad.addColorStop(0, isDark ? 'rgba(245, 130, 32, 0.04)' : 'rgba(217, 106, 11, 0.03)')
      subGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = subGrad
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y)

      // ═══ PARTICLES — circles, diamonds, squares ═══
      g.particles.forEach((p) => {
        ctx.globalAlpha = p.life * 0.6
        ctx.fillStyle = p.color || accentColor
        const size = p.size ?? (p.life * 4)
        const shape = p.shape || 'circle'

        if (shape === 'circle') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (shape === 'diamond') {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(Math.PI / 4)
          ctx.fillRect(-size / 2, -size / 2, size, size)
          ctx.restore()
        } else {
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size)
        }
      })
      ctx.globalAlpha = 1

      // ═══ AGENT ═══
      const drawAgentY = g.isDucking ? GROUND_Y - AGENT_H * 0.6 : g.agentY
      const drawAgentH = g.isDucking ? AGENT_H * 0.6 : AGENT_H

      drawAgent(ctx, 50, drawAgentY, drawAgentH, {
        isDucking: g.isDucking,
        isJumping: g.isJumping,
        jumpCount: g.jumpCount,
        legFrame: g.legFrame,
        frameCount: g.frameCount,
        isBoosted,
        doubleJumpTrail: g.doubleJumpTrail,
        bgColor: sc.bg,
        isDark,
      })

      // ═══ OBSTACLES — upgraded ═══
      g.obstacles.forEach((o) => {
        if (o.flying) {
          // Flying obstacles — bobbing cloud with glow
          const bob = Math.sin(g.frameCount * 0.06 + o.x * 0.01) * 4
          const oy = o.y + bob

          ctx.save()
          ctx.shadowColor = isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(124, 58, 237, 0.3)'
          ctx.shadowBlur = 10

          const cloudColor = isDark ? '#6B21A8' : '#7C3AED'
          const cloudBorder = isDark ? '#9333EA' : '#8B5CF6'

          // Cloud body
          ctx.fillStyle = cloudColor
          ctx.globalAlpha = 0.9
          ctx.beginPath()
          ctx.roundRect(o.x, oy, o.w, o.h, o.h / 2)
          ctx.fill()

          // Inner shimmer gradient
          const shimmerGrad = ctx.createLinearGradient(o.x, oy, o.x, oy + o.h)
          shimmerGrad.addColorStop(0, 'rgba(255,255,255,0.12)')
          shimmerGrad.addColorStop(0.5, 'transparent')
          shimmerGrad.addColorStop(1, 'rgba(0,0,0,0.1)')
          ctx.fillStyle = shimmerGrad
          ctx.beginPath()
          ctx.roundRect(o.x, oy, o.w, o.h, o.h / 2)
          ctx.fill()

          ctx.restore()

          // Border
          ctx.strokeStyle = cloudBorder
          ctx.lineWidth = 1
          ctx.globalAlpha = 0.7
          ctx.beginPath()
          ctx.roundRect(o.x, oy, o.w, o.h, o.h / 2)
          ctx.stroke()

          // Glitch lines
          ctx.strokeStyle = isDark ? 'rgba(196, 181, 253, 0.3)' : 'rgba(124, 58, 237, 0.3)'
          ctx.lineWidth = 1
          for (let i = 0; i < 2; i++) {
            const ly = oy + o.h * 0.3 + i * (o.h * 0.25)
            const lx = o.x + 8 + Math.sin(g.frameCount * 0.12 + i) * 4
            ctx.beginPath()
            ctx.moveTo(lx, ly)
            ctx.lineTo(lx + o.w * 0.5, ly)
            ctx.stroke()
          }
          ctx.globalAlpha = 1

          // Label pill
          ctx.font = 'bold 8px monospace'
          ctx.textAlign = 'center'
          const fLabelW = ctx.measureText(o.label).width + 10
          const fLabelX = o.x + o.w / 2
          const fLabelY = oy - 10
          ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(124, 58, 237, 0.15)'
          ctx.beginPath()
          ctx.roundRect(fLabelX - fLabelW / 2, fLabelY - 8, fLabelW, 13, 6)
          ctx.fill()
          ctx.fillStyle = isDark ? '#C4B5FD' : '#6D28D9'
          ctx.fillText(o.label, fLabelX, fLabelY)
        } else {
          // ── Ground obstacles — rounded with glow + danger gradient ──
          ctx.save()
          ctx.shadowColor = isDark ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.2)'
          ctx.shadowBlur = 6

          // Body — rounded rectangle
          ctx.fillStyle = fgColor
          ctx.beginPath()
          ctx.roundRect(o.x, o.y, o.w, o.h, 4)
          ctx.fill()

          // Danger stripe gradient across top
          const dangerGrad = ctx.createLinearGradient(o.x, o.y, o.x + o.w, o.y)
          dangerGrad.addColorStop(0, '#dc2626')
          dangerGrad.addColorStop(0.5, '#ef4444')
          dangerGrad.addColorStop(1, '#dc2626')
          ctx.fillStyle = dangerGrad
          ctx.beginPath()
          ctx.roundRect(o.x, o.y, o.w, 4, [4, 4, 0, 0])
          ctx.fill()

          // Subtle inner highlight
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'
          ctx.beginPath()
          ctx.roundRect(o.x + 2, o.y + 5, o.w - 4, o.h * 0.3, 2)
          ctx.fill()

          ctx.restore()

          // Label pill
          ctx.font = 'bold 10px monospace'
          ctx.textAlign = 'center'
          const gLabelW = ctx.measureText(o.label).width + 10
          const gLabelX = o.x + o.w / 2
          const gLabelY = o.y - 14
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'
          ctx.beginPath()
          ctx.roundRect(gLabelX - gLabelW / 2, gLabelY - 9, gLabelW, 14, 7)
          ctx.fill()
          ctx.fillStyle = isDark ? '#E4E4E7' : '#3F3F46'
          ctx.fillText(o.label, gLabelX, gLabelY)
        }
      })

      // ═══ HUD — with pill backgrounds ═══
      // Top-left: game title + mode
      ctx.save()
      ctx.shadowColor = 'rgba(245, 130, 32, 0.2)'
      ctx.shadowBlur = 4
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'left'
      ctx.fillStyle = accentColor
      ctx.fillText('AI RUNNER', 16, 22)
      ctx.restore()
      ctx.font = '10px monospace'
      ctx.fillStyle = mutedColor
      ctx.fillText(settingsRef.current.label.toUpperCase(), 16, 36)

      // Stage badge
      if (stage > 0) {
        const stageTxt = `STAGE ${stage + 1}`
        ctx.font = 'bold 9px monospace'
        const stageW = ctx.measureText(stageTxt).width + 10
        ctx.fillStyle = isDark ? 'rgba(245, 130, 32, 0.12)' : 'rgba(217, 106, 11, 0.08)'
        ctx.beginPath()
        ctx.roundRect(14, 42, stageW, 15, 7)
        ctx.fill()
        ctx.fillStyle = accentColor
        ctx.fillText(stageTxt, 19, 53)
      }

      // Top-right: score + speed + best — pill background
      ctx.textAlign = 'right'
      const scoreStr = `${Math.floor(g.distance / 10)}`
      ctx.font = 'bold 14px monospace'
      const scoreW = ctx.measureText(scoreStr).width + 16
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
      ctx.beginPath()
      ctx.roundRect(CANVAS_W - 14 - scoreW, 8, scoreW + 2, 22, 6)
      ctx.fill()
      ctx.fillStyle = fgColor
      ctx.fillText(scoreStr, CANVAS_W - 16, 25)

      ctx.font = '10px monospace'
      ctx.fillStyle = mutedColor
      ctx.fillText(`${g.speed.toFixed(1)}x`, CANVAS_W - 16, 42)
      if (highScore > 0) {
        ctx.fillStyle = isDark ? 'rgba(245, 130, 32, 0.6)' : 'rgba(217, 106, 11, 0.5)'
        ctx.fillText(`BEST ${highScore}`, CANVAS_W - 16, 56)
      }

      // ═══ COMBO DISPLAY — with scale bounce ═══
      if (g.combo >= 2) {
        ctx.save()
        ctx.textAlign = 'center'
        const comboAlpha = Math.min(1, g.comboTimer / 60)
        const cScale = Math.max(1, g.comboScale)
        ctx.translate(CANVAS_W / 2, GROUND_Y + 22)
        ctx.scale(cScale, cScale)
        ctx.translate(-CANVAS_W / 2, -(GROUND_Y + 22))

        const comboTxt = `NEAR MISS x${g.combo}`
        ctx.font = 'bold 12px monospace'
        const comboW = ctx.measureText(comboTxt).width + 14
        ctx.fillStyle = isDark ? `rgba(16, 185, 129, ${comboAlpha * 0.15})` : `rgba(5, 150, 105, ${comboAlpha * 0.1})`
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - comboW / 2, GROUND_Y + 12, comboW, 18, 9)
        ctx.fill()
        ctx.fillStyle = isDark ? `rgba(52, 211, 153, ${comboAlpha})` : `rgba(5, 150, 105, ${comboAlpha})`
        ctx.fillText(comboTxt, CANVAS_W / 2, GROUND_Y + 25)
        ctx.restore()
      } else if (g.nearMissFlash > 0) {
        ctx.textAlign = 'center'
        ctx.font = 'bold 10px monospace'
        ctx.fillStyle = isDark ? 'rgba(52, 211, 153, 0.8)' : 'rgba(5, 150, 105, 0.8)'
        ctx.fillText('CLOSE!', CANVAS_W / 2, GROUND_Y + 25)
      }

      // ═══ MILESTONE — scale-bounce text ═══
      if (g.milestoneFlash > 15) {
        ctx.save()
        ctx.textAlign = 'center'
        const mAlpha = Math.min(1, (g.milestoneFlash - 15) / 25)
        const mScale = Math.max(1, g.milestoneScale)
        ctx.translate(CANVAS_W / 2, 75)
        ctx.scale(mScale, mScale)
        ctx.translate(-CANVAS_W / 2, -75)

        const mTxt = `${g.lastMilestone * 500}`
        ctx.font = 'bold 22px monospace'
        // Glow
        ctx.shadowColor = `rgba(245, 130, 32, ${mAlpha * 0.6})`
        ctx.shadowBlur = 12
        ctx.fillStyle = `rgba(245, 130, 32, ${mAlpha})`
        ctx.fillText(mTxt, CANVAS_W / 2, 80)
        ctx.restore()
      }

      // ═══ BOOST HUD ═══
      if (isBoosted) {
        ctx.textAlign = 'center'
        const boostTxt = `BOOST ${Math.ceil(g.boostTimer / 60)}s`
        ctx.font = 'bold 11px monospace'
        const boostW = ctx.measureText(boostTxt).width + 14
        ctx.fillStyle = 'rgba(34, 211, 238, 0.12)'
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - boostW / 2, 8, boostW, 18, 9)
        ctx.fill()
        ctx.fillStyle = '#22D3EE'
        ctx.fillText(boostTxt, CANVAS_W / 2, 21)
      } else if (g.boostTimer <= 0 && g.distance > 0) {
        ctx.textAlign = 'center'
        ctx.font = '9px monospace'
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        ctx.fillText('B = boost \u00B7 \u2193 = duck', CANVAS_W / 2, 22)
      }

      ctx.restore()

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [gameState, spawnObstacle, highScore])

  // Draw idle/dead (with shake support for death)
  useEffect(() => {
    if (gameState === 'running') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const isDark = document.documentElement.classList.contains('dark')
    const bgColor = isDark ? '#09090B' : '#FAFAF8'
    const fgColor = isDark ? '#FAFAFA' : '#1A1A2E'
    const mutedColor = isDark ? '#71717A' : '#8E8E9A'
    const accentColor = isDark ? '#F58220' : '#D96A0B'
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,46,0.1)'

    // Animate death screen shake
    if (gameState === 'dead' && gameRef.current.shakeTimer > 0) {
      let shakeRaf: number
      function shakeLoop() {
        const g = gameRef.current
        if (g.shakeTimer <= 0) {
          drawStatic()
          return
        }
        g.shakeTimer--
        const intensity = g.shakeIntensity * (g.shakeTimer / 15)
        const sx = (Math.random() - 0.5) * intensity
        const sy = (Math.random() - 0.5) * intensity

        ctx.save()
        ctx.translate(sx, sy)
        drawStatic()
        ctx.restore()

        // Draw remaining particles
        g.particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life -= 0.03 })
        g.particles = g.particles.filter((p) => p.life > 0)
        g.particles.forEach((p) => {
          ctx.globalAlpha = p.life * 0.5
          ctx.fillStyle = p.color || accentColor
          const size = p.size ?? (p.life * 4)
          ctx.fillRect(p.x - size / 2 + sx, p.y - size / 2 + sy, size, size)
        })
        ctx.globalAlpha = 1

        shakeRaf = requestAnimationFrame(shakeLoop)
      }
      shakeRaf = requestAnimationFrame(shakeLoop)
      return () => cancelAnimationFrame(shakeRaf)
    }

    drawStatic()

    function drawStatic() {
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Grid
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
      ctx.lineWidth = 0.5
      for (let y = 60; y < GROUND_Y; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
      }

      // Glowing ground line
      ctx.save()
      ctx.shadowColor = isDark ? 'rgba(245, 130, 32, 0.25)' : 'rgba(217, 106, 11, 0.15)'
      ctx.shadowBlur = 6
      ctx.strokeStyle = isDark ? 'rgba(245, 130, 32, 0.2)' : 'rgba(217, 106, 11, 0.12)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke()
      ctx.restore()
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke()

      // Sub-ground fade
      const sg = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_H)
      sg.addColorStop(0, isDark ? 'rgba(245, 130, 32, 0.03)' : 'rgba(217, 106, 11, 0.02)')
      sg.addColorStop(1, 'transparent')
      ctx.fillStyle = sg
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y)

      // Agent — idle pose
      drawAgent(ctx, 50, GROUND_Y - AGENT_H, AGENT_H, {
        isDucking: false,
        isJumping: false,
        jumpCount: 0,
        legFrame: 0,
        frameCount: Math.floor(Date.now() / 16),
        isBoosted: false,
        doubleJumpTrail: 0,
        bgColor,
        isDark,
      })

      // Title badge top-left
      ctx.save()
      ctx.shadowColor = 'rgba(245, 130, 32, 0.2)'
      ctx.shadowBlur = 4
      ctx.textAlign = 'left'
      ctx.font = 'bold 10px monospace'
      ctx.fillStyle = accentColor
      ctx.fillText('AI RUNNER', 16, 24)
      ctx.restore()

      ctx.textAlign = 'center'
      if (gameState === 'idle') {
        // Title with subtle glow
        ctx.save()
        ctx.shadowColor = isDark ? 'rgba(250, 250, 250, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        ctx.shadowBlur = 8
        ctx.font = '600 22px Georgia, serif'
        ctx.fillStyle = fgColor
        ctx.fillText('Press Space to Deploy', CANVAS_W / 2, GROUND_Y / 2 - 10)
        ctx.restore()

        ctx.font = '11px monospace'
        ctx.fillStyle = mutedColor
        ctx.fillText('Dodge bugs, firewalls, latency & hallucinations', CANVAS_W / 2, GROUND_Y / 2 + 18)

        // Controls in a pill
        const ctrlTxt = 'Space = jump (x2!)  \u00B7  \u2193 = duck  \u00B7  B = boost'
        ctx.font = '10px monospace'
        const ctrlW = ctx.measureText(ctrlTxt).width + 20
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - ctrlW / 2, GROUND_Y / 2 + 28, ctrlW, 20, 10)
        ctx.fill()
        ctx.fillStyle = mutedColor
        ctx.fillText(ctrlTxt, CANVAS_W / 2, GROUND_Y / 2 + 42)
      } else {
        // Death screen — with glitch scanlines
        // Subtle red scanline overlay
        ctx.globalAlpha = 0.03
        for (let sy = 0; sy < CANVAS_H; sy += 4) {
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(0, sy, CANVAS_W, 1)
        }
        ctx.globalAlpha = 1

        // "Killed by" label pill at top
        if (killedBy) {
          const killerTxt = `Killed by: ${killedBy.label.replace('\n', ' ')}`
          ctx.font = 'bold 10px monospace'
          const kW = ctx.measureText(killerTxt).width + 16
          ctx.fillStyle = isDark ? 'rgba(220, 38, 38, 0.12)' : 'rgba(220, 38, 38, 0.08)'
          ctx.beginPath()
          ctx.roundRect(CANVAS_W / 2 - kW / 2, GROUND_Y / 2 - 52, kW, 18, 9)
          ctx.fill()
          ctx.fillStyle = '#EF4444'
          ctx.fillText(killerTxt, CANVAS_W / 2, GROUND_Y / 2 - 39)
        }

        // Title
        ctx.save()
        ctx.shadowColor = 'rgba(220, 38, 38, 0.4)'
        ctx.shadowBlur = 10
        ctx.font = '600 20px Georgia, serif'
        ctx.fillStyle = '#dc2626'
        ctx.fillText('Model Crashed', CANVAS_W / 2, GROUND_Y / 2 - 18)
        ctx.restore()

        // Score + best on one line in pill
        const scoreAndBest = highScore > 0
          ? `Distance: ${score}  \u00B7  Best: ${highScore}`
          : `Distance: ${score}`
        ctx.font = 'bold 13px monospace'
        const sbW = ctx.measureText(scoreAndBest).width + 20
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - sbW / 2, GROUND_Y / 2 - 2, sbW, 22, 8)
        ctx.fill()
        ctx.fillStyle = fgColor
        ctx.fillText(scoreAndBest, CANVAS_W / 2, GROUND_Y / 2 + 14)

        // Witty death message
        if (killedBy) {
          ctx.font = 'italic 11px Georgia, serif'
          ctx.fillStyle = mutedColor
          // Word wrap the message if needed
          const msg = killedBy.message
          if (ctx.measureText(msg).width > CANVAS_W - 120) {
            // Split at roughly halfway on a space
            const mid = Math.floor(msg.length / 2)
            let splitAt = msg.lastIndexOf(' ', mid)
            if (splitAt < 10) splitAt = msg.indexOf(' ', mid)
            const line1 = msg.substring(0, splitAt)
            const line2 = msg.substring(splitAt + 1)
            ctx.fillText(line1, CANVAS_W / 2, GROUND_Y / 2 + 34)
            ctx.fillText(line2, CANVAS_W / 2, GROUND_Y / 2 + 48)
          } else {
            ctx.fillText(msg, CANVAS_W / 2, GROUND_Y / 2 + 38)
          }
        }

        // Redeploy in a pill
        const redeployTxt = 'Press Space to Redeploy'
        ctx.font = '10px monospace'
        const rdW = ctx.measureText(redeployTxt).width + 20
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - rdW / 2, GROUND_Y / 2 + 56, rdW, 18, 10)
        ctx.fill()
        ctx.fillStyle = mutedColor
        ctx.fillText(redeployTxt, CANVAS_W / 2, GROUND_Y / 2 + 69)
      }
    }
  }, [gameState, score, highScore, killedBy])

  return (
    <div ref={containerRef}>
      {/* Controls bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--fg-subtle)' }}>
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            disabled={gameState === 'running'}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1"
            style={{
              background: 'var(--bg-warm, #f5f5f0)',
              color: 'var(--fg)',
              border: '1px solid var(--border-strong)',
              opacity: gameState === 'running' ? 0.5 : 1,
            }}
          >
            {(Object.entries(DIFFICULTY_SETTINGS) as [Difficulty, typeof DIFFICULTY_SETTINGS.normal][]).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <span className="hidden text-xs sm:inline" style={{ color: 'var(--fg-subtle)' }}>
            {DIFFICULTY_SETTINGS[difficulty].desc}
          </span>
        </div>

        {gameState === 'running' && (
          <button
            onClick={activateBoost}
            disabled={boostActive}
            className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all"
            style={{
              background: boostActive ? 'rgba(34, 211, 238, 0.15)' : 'var(--bg-warm, #f5f5f0)',
              color: boostActive ? '#22D3EE' : 'var(--fg-muted)',
              border: `1px solid ${boostActive ? 'rgba(34, 211, 238, 0.3)' : 'var(--border-strong)'}`,
            }}
          >
            {boostActive ? '\u26A1 Active' : '\u26A1 Boost (B)'}
          </button>
        )}
      </div>

      {/* Canvas */}
      <div
        className="overflow-hidden rounded-lg border"
        style={{ borderColor: 'var(--border-strong)' }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block w-full cursor-pointer"
          style={{ maxWidth: CANVAS_W, imageRendering: 'auto' }}
          onClick={() => {
            if (gameState === 'idle' || gameState === 'dead') startGame()
            else jump()
          }}
        />
      </div>

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between text-xs" style={{ color: 'var(--fg-subtle)' }}>
        <span>Space = jump (x2) &middot; &darr; = duck &middot; B = boost &middot; tap works too</span>
        {highScore > 0 && <span>Best: {highScore}</span>}
      </div>
    </div>
  )
}
