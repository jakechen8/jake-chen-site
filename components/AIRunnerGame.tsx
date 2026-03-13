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

// BondKnows brand orange
const BK_ORANGE = '#F58220'
const BK_ORANGE_LIGHT = '#FFB366'
const BK_ORANGE_DARK = '#D96A0B'

// Draw the agent — sleek, geometric, modern
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
  const { isDucking, isJumping, legFrame, frameCount, isBoosted, doubleJumpTrail, bgColor, isDark } = opts

  // Pick color based on state
  const baseColor = doubleJumpTrail > 0 ? '#FFB366' : (isBoosted ? '#22D3EE' : BK_ORANGE)
  const glowColor = doubleJumpTrail > 0 ? 'rgba(255, 179, 102, 0.4)' : (isBoosted ? 'rgba(34, 211, 238, 0.35)' : 'rgba(245, 130, 32, 0.35)')

  // Glow effect
  ctx.save()
  ctx.shadowColor = glowColor
  ctx.shadowBlur = isBoosted ? 18 : 12

  if (isDucking) {
    // ── DUCKING FORM ── low, wide, aerodynamic
    const dw = AGENT_W + 8
    const dh = h * 0.55
    const dx = x - 4
    const dy = y + h - dh

    // Body — rounded capsule
    ctx.fillStyle = baseColor
    ctx.beginPath()
    ctx.roundRect(dx, dy, dw, dh, dh / 2)
    ctx.fill()

    // Visor — horizontal slit
    ctx.fillStyle = isDark ? '#1A1A2E' : '#0F172A'
    ctx.beginPath()
    ctx.roundRect(dx + dw * 0.45, dy + dh * 0.25, dw * 0.45, dh * 0.3, 3)
    ctx.fill()

    // Visor glow dot
    ctx.fillStyle = '#FFFFFF'
    ctx.globalAlpha = 0.7 + Math.sin(frameCount * 0.15) * 0.3
    ctx.beginPath()
    ctx.arc(dx + dw * 0.82, dy + dh * 0.4, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    // Speed streaks behind when ducking
    ctx.strokeStyle = baseColor
    ctx.globalAlpha = 0.3
    ctx.lineWidth = 1.5
    for (let i = 0; i < 3; i++) {
      const sy = dy + dh * 0.2 + i * (dh * 0.3)
      ctx.beginPath()
      ctx.moveTo(dx - 5 - i * 4, sy)
      ctx.lineTo(dx - 15 - i * 6 - Math.sin(frameCount * 0.2 + i) * 4, sy)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  } else {
    // ── STANDING / JUMPING FORM ── sleek humanoid

    // Tilt when jumping
    const tilt = isJumping ? (opts.jumpCount >= 2 ? -0.12 : -0.06) : 0
    ctx.save()
    ctx.translate(cx, y + h)
    ctx.rotate(tilt)
    ctx.translate(-cx, -(y + h))

    // === LEGS ===
    const legPhase = Math.sin(legFrame * 0.3)
    ctx.fillStyle = baseColor

    if (!isJumping) {
      // Running legs — angled, dynamic
      const leftLen = 14 + legPhase * 4
      const rightLen = 14 - legPhase * 4
      // Left leg
      ctx.beginPath()
      ctx.roundRect(cx - 8, y + h - leftLen, 5, leftLen, 2)
      ctx.fill()
      // Right leg
      ctx.beginPath()
      ctx.roundRect(cx + 3, y + h - rightLen, 5, rightLen, 2)
      ctx.fill()
      // Feet — small rounded
      ctx.beginPath()
      ctx.arc(cx - 5.5, y + h, 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx + 5.5, y + h, 2.5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Jumping — tucked up, knees bent
      ctx.beginPath()
      ctx.roundRect(cx - 9, y + h - 10, 5, 8, 2)
      ctx.fill()
      ctx.beginPath()
      ctx.roundRect(cx + 4, y + h - 10, 5, 8, 2)
      ctx.fill()
    }

    // === BODY === — rounded trapezoid, narrower at waist
    const bodyTop = y + 12
    const bodyBot = y + h - 12
    const bodyH = bodyBot - bodyTop
    ctx.fillStyle = baseColor
    ctx.beginPath()
    ctx.moveTo(cx - 10, bodyBot)
    ctx.lineTo(cx - 12, bodyTop + bodyH * 0.3)
    ctx.quadraticCurveTo(cx - 12, bodyTop, cx - 6, bodyTop)
    ctx.lineTo(cx + 6, bodyTop)
    ctx.quadraticCurveTo(cx + 12, bodyTop, cx + 12, bodyTop + bodyH * 0.3)
    ctx.lineTo(cx + 10, bodyBot)
    ctx.closePath()
    ctx.fill()

    // Core energy — pulsing circle in chest
    const pulseR = 3 + Math.sin(frameCount * 0.08) * 0.8
    const coreY = bodyTop + bodyH * 0.45
    ctx.fillStyle = '#FFFFFF'
    ctx.globalAlpha = 0.6 + Math.sin(frameCount * 0.08) * 0.2
    ctx.beginPath()
    ctx.arc(cx, coreY, pulseR, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 0.2
    ctx.beginPath()
    ctx.arc(cx, coreY, pulseR + 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    // === HEAD === — helmet with visor
    const headR = 9
    const headY = y + headR + 1

    // Helmet
    ctx.fillStyle = baseColor
    ctx.beginPath()
    ctx.arc(cx, headY, headR, 0, Math.PI * 2)
    ctx.fill()

    // Visor — angled slit across the face
    ctx.fillStyle = isDark ? '#1A1A2E' : '#0F172A'
    ctx.beginPath()
    ctx.roundRect(cx - 2, headY - 4, headR + 4, 5, 2)
    ctx.fill()

    // Visor shine
    ctx.fillStyle = '#FFFFFF'
    ctx.globalAlpha = 0.5 + Math.sin(frameCount * 0.12) * 0.3
    ctx.beginPath()
    ctx.arc(cx + headR - 2, headY - 2, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    // === ANTENNA === — energy spike
    ctx.strokeStyle = baseColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, headY - headR)
    ctx.lineTo(cx, headY - headR - 7)
    ctx.stroke()

    // Antenna tip — pulsing
    const tipR = 2.5 + Math.sin(frameCount * 0.15) * 0.8
    ctx.fillStyle = '#FFFFFF'
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.arc(cx, headY - headR - 8, tipR, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = baseColor
    ctx.globalAlpha = 0.3
    ctx.beginPath()
    ctx.arc(cx, headY - headR - 8, tipR + 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.restore() // undo tilt
  }

  ctx.restore() // undo shadow/glow

  // === DOUBLE JUMP READY INDICATOR ===
  if (opts.jumpCount === 1 && isJumping) {
    const ringR = AGENT_W * 0.6
    const ringAlpha = 0.3 + Math.sin(frameCount * 0.25) * 0.15
    ctx.globalAlpha = ringAlpha
    ctx.strokeStyle = BK_ORANGE_LIGHT
    ctx.lineWidth = 1.5
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.arc(cx, y + h / 2, ringR, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
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
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string; size?: number }[],
    boostTimer: 0,
    shakeTimer: 0,
    shakeIntensity: 0,
    combo: 0,
    comboTimer: 0,
    lastMilestone: 0,
    milestoneFlash: 0,
    speedLines: [] as { x: number; y: number; len: number; alpha: number }[],
    nearMissFlash: 0,
    doubleJumpTrail: 0, // visual indicator for double jump
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
      const flyTypes: { type: Obstacle['type']; label: string }[] = [
        { type: 'cloud', label: 'HALLUCINATION' },
        { type: 'overfit', label: 'OVERFIT' },
        { type: 'leak', label: 'DATA LEAK' },
      ]
      const chosen = flyTypes[Math.floor(Math.random() * flyTypes.length)]
      const w = 50 + Math.random() * 30
      const h = 20 + Math.random() * 15
      // Position at jump height — the sweet spot where single jumps peak
      const flyY = GROUND_Y - AGENT_H - 45 - Math.random() * 35
      g.obstacles.push({
        x: CANVAS_W + 50,
        w,
        h,
        y: flyY,
        type: chosen.type,
        label: chosen.label,
        flying: true,
      })
    } else {
      const types: Obstacle['type'][] = ['bug', 'firewall', 'latency', 'hallucination']
      const labels: Record<string, string> = {
        bug: 'BUG',
        firewall: 'FIREWALL',
        latency: 'LATENCY',
        hallucination: 'HALLUCINATION',
      }
      const type = types[Math.floor(Math.random() * types.length)]
      const h = 25 + Math.random() * 35
      const w = 22 + Math.random() * 18
      g.obstacles.push({
        x: CANVAS_W + 50,
        w,
        h,
        y: GROUND_Y - h,
        type,
        label: labels[type],
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

      // Double jump burst particles
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8
        g.particles.push({
          x: 50 + AGENT_W / 2,
          y: g.agentY + AGENT_H / 2,
          vx: Math.cos(angle) * 2.5,
          vy: Math.sin(angle) * 2.5,
          life: 0.5,
          color: '#F59E0B',
          size: 3,
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
    boostRef.current = false
    setBoostActive(false)
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
        g.milestoneFlash = 40 // frames
        // Celebration particles
        for (let i = 0; i < 20; i++) {
          g.particles.push({
            x: CANVAS_W / 2 + (Math.random() - 0.5) * 200,
            y: 50 + Math.random() * 50,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 2 + 1,
            life: 1,
            color: ['#F59E0B', '#22D3EE', '#10B981', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 5)],
            size: 3 + Math.random() * 3,
          })
        }
      }
      if (g.milestoneFlash > 0) g.milestoneFlash--

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

      // Trail
      if (g.frameCount % 3 === 0) {
        const trailColor = g.doubleJumpTrail > 0 ? '#F59E0B' : (isBoosted ? '#22D3EE' : '')
        g.particles.push({
          x: 50,
          y: g.agentY + AGENT_H / 2 + (Math.random() - 0.5) * 10,
          vx: -1 - Math.random(),
          vy: (Math.random() - 0.5) * 0.5,
          life: 0.6 + Math.random() * 0.4,
          color: trailColor,
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
          // Death
          for (let i = 0; i < 20; i++) {
            g.particles.push({
              x: 50 + AGENT_W / 2, y: g.agentY + AGENT_H / 2,
              vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
              life: 1, color: '#EF4444', size: 2 + Math.random() * 3,
            })
          }
          g.shakeTimer = 15
          g.shakeIntensity = 8
          const finalScore = Math.floor(g.distance / 10)
          setScore(finalScore)
          setHighScore((prev) => Math.max(prev, finalScore))
          setGameState('dead')
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
            g.comboTimer = 120 // 2 seconds to maintain combo
            g.nearMissFlash = 15

            // Near-miss sparkle
            for (let i = 0; i < 5; i++) {
              g.particles.push({
                x: 50 + AGENT_W / 2 + (Math.random() - 0.5) * 20,
                y: g.agentY + (Math.random()) * AGENT_H,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: 0.6,
                color: '#10B981',
                size: 2,
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

      // Milestone flash
      if (g.milestoneFlash > 0) {
        const flashAlpha = (g.milestoneFlash / 40) * 0.08
        ctx.fillStyle = isDark ? `rgba(245, 158, 11, ${flashAlpha})` : `rgba(180, 83, 9, ${flashAlpha})`
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      }

      // Near-miss green flash
      if (g.nearMissFlash > 0) {
        const nmAlpha = (g.nearMissFlash / 15) * 0.06
        ctx.fillStyle = `rgba(16, 185, 129, ${nmAlpha})`
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      }

      // Boost tint
      if (isBoosted) {
        ctx.fillStyle = isDark ? 'rgba(34, 211, 238, 0.03)' : 'rgba(6, 182, 212, 0.04)'
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      }

      // Ground
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke()

      // Progressive grid — gets denser with stage
      const gridAlpha = sc.gridAlpha
      ctx.strokeStyle = isDark ? `rgba(255,255,255,${gridAlpha})` : `rgba(0,0,0,${gridAlpha})`
      const spacing = sc.gridSpacing
      // Horizontal grid
      for (let y = spacing; y < GROUND_Y; y += spacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
      }
      // Vertical grid lines appear at stage 2+
      if (stage >= 2) {
        const vOffset = (g.frameCount * effectiveSpeed * 0.5) % spacing
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${gridAlpha * 0.6})` : `rgba(0,0,0,${gridAlpha * 0.6})`
        for (let x = -vOffset; x < CANVAS_W; x += spacing) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GROUND_Y); ctx.stroke()
        }
      }

      // Speed lines
      g.speedLines.forEach(sl => {
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${sl.alpha})` : `rgba(0,0,0,${sl.alpha * 0.7})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(sl.x, sl.y)
        ctx.lineTo(sl.x + sl.len, sl.y)
        ctx.stroke()
      })
      ctx.lineWidth = 1

      // Particles
      g.particles.forEach((p) => {
        ctx.globalAlpha = p.life * 0.5
        ctx.fillStyle = p.color || accentColor
        const size = p.size ?? (p.life * 4)
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size)
      })
      ctx.globalAlpha = 1

      // Agent — modern design
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

      // Obstacles
      g.obstacles.forEach((o) => {
        if (o.flying) {
          // Flying obstacles — cloud-like shape
          ctx.globalAlpha = 0.85
          const cloudColor = isDark ? '#6B21A8' : '#7C3AED'
          const cloudBorder = isDark ? '#9333EA' : '#8B5CF6'

          // Cloud body
          ctx.fillStyle = cloudColor
          ctx.beginPath()
          ctx.roundRect(o.x, o.y, o.w, o.h, 8)
          ctx.fill()

          // Cloud shimmer
          ctx.strokeStyle = cloudBorder
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.roundRect(o.x, o.y, o.w, o.h, 8)
          ctx.stroke()

          // Glitch lines inside cloud
          ctx.strokeStyle = isDark ? 'rgba(168, 85, 247, 0.5)' : 'rgba(124, 58, 237, 0.4)'
          ctx.lineWidth = 1
          for (let i = 0; i < 3; i++) {
            const ly = o.y + 5 + i * (o.h / 4)
            const lx = o.x + 5 + Math.sin(g.frameCount * 0.1 + i) * 3
            ctx.beginPath()
            ctx.moveTo(lx, ly)
            ctx.lineTo(lx + o.w * 0.6, ly)
            ctx.stroke()
          }

          ctx.globalAlpha = 1

          // Label
          ctx.font = 'bold 9px monospace'
          ctx.textAlign = 'center'
          const labelW = ctx.measureText(o.label).width + 8
          const labelX = o.x + o.w / 2
          const labelY = o.y - 8
          ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(124, 58, 237, 0.12)'
          ctx.beginPath()
          ctx.roundRect(labelX - labelW / 2, labelY - 9, labelW, 13, 3)
          ctx.fill()
          ctx.fillStyle = isDark ? '#C4B5FD' : '#6D28D9'
          ctx.fillText(o.label, labelX, labelY)
        } else {
          // Ground obstacles — same as before but bigger labels
          ctx.fillStyle = fgColor
          ctx.fillRect(o.x, o.y, o.w, o.h)
          ctx.fillStyle = '#dc2626'
          ctx.fillRect(o.x, o.y, o.w, 3)

          // Label
          ctx.font = 'bold 11px monospace'
          ctx.textAlign = 'center'
          const labelW = ctx.measureText(o.label).width + 8
          const labelX = o.x + o.w / 2
          const labelY = o.y - 12
          ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
          ctx.beginPath()
          ctx.roundRect(labelX - labelW / 2, labelY - 10, labelW, 14, 3)
          ctx.fill()
          ctx.fillStyle = isDark ? '#E4E4E7' : '#3F3F46'
          ctx.fillText(o.label, labelX, labelY)
        }
      })

      // HUD
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'left'
      ctx.fillStyle = accentColor
      ctx.fillText('AI RUNNER', 16, 22)
      ctx.font = '10px monospace'
      ctx.fillStyle = mutedColor
      ctx.fillText(settingsRef.current.label.toUpperCase(), 16, 36)

      // Stage indicator
      if (stage > 0) {
        ctx.font = '9px monospace'
        ctx.fillStyle = accentColor
        ctx.globalAlpha = 0.6
        ctx.fillText(`STAGE ${stage + 1}`, 16, 50)
        ctx.globalAlpha = 1
      }

      ctx.textAlign = 'right'
      ctx.font = '13px monospace'
      ctx.fillStyle = fgColor
      ctx.fillText(`${Math.floor(g.distance / 10)}`, CANVAS_W - 16, 24)
      ctx.font = '10px monospace'
      ctx.fillStyle = mutedColor
      ctx.fillText(`SPEED ${g.speed.toFixed(1)}x`, CANVAS_W - 16, 40)
      if (highScore > 0) {
        ctx.fillText(`BEST ${highScore}`, CANVAS_W - 16, 54)
      }

      // Combo display
      if (g.combo >= 2) {
        ctx.textAlign = 'center'
        ctx.font = 'bold 12px monospace'
        const comboAlpha = Math.min(1, g.comboTimer / 60)
        ctx.fillStyle = isDark ? `rgba(16, 185, 129, ${comboAlpha})` : `rgba(5, 150, 105, ${comboAlpha})`
        ctx.fillText(`NEAR MISS x${g.combo}`, CANVAS_W / 2, GROUND_Y + 20)
      } else if (g.nearMissFlash > 0) {
        ctx.textAlign = 'center'
        ctx.font = 'bold 10px monospace'
        ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.7)' : 'rgba(5, 150, 105, 0.7)'
        ctx.fillText('CLOSE!', CANVAS_W / 2, GROUND_Y + 20)
      }

      // Milestone text
      if (g.milestoneFlash > 20) {
        ctx.textAlign = 'center'
        ctx.font = 'bold 16px monospace'
        const mAlpha = Math.min(1, (g.milestoneFlash - 20) / 20)
        ctx.fillStyle = `rgba(245, 158, 11, ${mAlpha})`
        ctx.fillText(`${g.lastMilestone * 500}!`, CANVAS_W / 2, 80)
      }

      // Boost HUD
      if (isBoosted) {
        ctx.textAlign = 'center'
        ctx.font = 'bold 11px monospace'
        ctx.fillStyle = '#22D3EE'
        ctx.fillText(`BOOST ${Math.ceil(g.boostTimer / 60)}s`, CANVAS_W / 2, 22)
      } else if (g.boostTimer <= 0 && g.distance > 0) {
        ctx.textAlign = 'center'
        ctx.font = '9px monospace'
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
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

      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke()

      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
      for (let y = 60; y < GROUND_Y; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
      }

      // Agent — idle pose
      drawAgent(ctx, 50, GROUND_Y - AGENT_H, AGENT_H, {
        isDucking: false,
        isJumping: false,
        jumpCount: 0,
        legFrame: 0,
        frameCount: Math.floor(Date.now() / 16), // gentle pulse even when idle
        isBoosted: false,
        doubleJumpTrail: 0,
        bgColor,
        isDark,
      })

      ctx.textAlign = 'center'
      if (gameState === 'idle') {
        ctx.font = '600 20px Georgia, serif'
        ctx.fillStyle = fgColor
        ctx.fillText('Press Space to Deploy', CANVAS_W / 2, GROUND_Y / 2 - 10)
        ctx.font = '11px monospace'
        ctx.fillStyle = mutedColor
        ctx.fillText('Dodge bugs, firewalls, latency & hallucinations', CANVAS_W / 2, GROUND_Y / 2 + 15)
        ctx.fillText('Space = jump (x2!) \u00B7 \u2193 = duck \u00B7 B = boost', CANVAS_W / 2, GROUND_Y / 2 + 35)
      } else {
        ctx.font = '600 20px Georgia, serif'
        ctx.fillStyle = '#dc2626'
        ctx.fillText('Model Crashed', CANVAS_W / 2, GROUND_Y / 2 - 20)
        ctx.font = '14px monospace'
        ctx.fillStyle = fgColor
        ctx.fillText(`Distance: ${score}`, CANVAS_W / 2, GROUND_Y / 2 + 10)
        if (highScore > 0) {
          ctx.fillStyle = accentColor
          ctx.fillText(`Best: ${highScore}`, CANVAS_W / 2, GROUND_Y / 2 + 32)
        }
        ctx.font = '11px monospace'
        ctx.fillStyle = mutedColor
        ctx.fillText('Press Space to Redeploy', CANVAS_W / 2, GROUND_Y / 2 + 58)
      }

      ctx.textAlign = 'left'
      ctx.font = 'bold 10px monospace'
      ctx.fillStyle = accentColor
      ctx.fillText('AI RUNNER', 16, 24)
    }
  }, [gameState, score, highScore])

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
