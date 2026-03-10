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
}> = {
  chill: {
    gravity: 0.55,
    jumpForce: -12,
    baseSpeed: 3,
    speedIncrement: 0.0004,
    spawnBase: 140,
    label: 'Chill Mode',
    desc: 'Slower speed, wider gaps. Good for vibes.',
  },
  normal: {
    gravity: 0.7,
    jumpForce: -13,
    baseSpeed: 4,
    speedIncrement: 0.001,
    spawnBase: 100,
    label: 'Normal',
    desc: 'The standard run. Things get fast.',
  },
  chaos: {
    gravity: 0.8,
    jumpForce: -14,
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
  type: 'bug' | 'firewall' | 'latency' | 'hallucination'
  label: string
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
    obstacles: [] as Obstacle[],
    speed: 4,
    distance: 0,
    frameCount: 0,
    legFrame: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    boostTimer: 0,
  })

  const settingsRef = useRef(DIFFICULTY_SETTINGS.normal)

  const spawnObstacle = useCallback(() => {
    const types: Obstacle['type'][] = ['bug', 'firewall', 'latency', 'hallucination']
    const labels: Record<Obstacle['type'], string> = {
      bug: 'BUG',
      firewall: 'FIREWALL',
      latency: 'LATENCY',
      hallucination: 'HALLUCINATION',
    }
    const type = types[Math.floor(Math.random() * types.length)]
    const h = 25 + Math.random() * 35
    const w = 22 + Math.random() * 18
    gameRef.current.obstacles.push({
      x: CANVAS_W + 50,
      w,
      h,
      type,
      label: labels[type],
    })
  }, [])

  const jump = useCallback(() => {
    const g = gameRef.current
    if (!g.isJumping) {
      g.agentVY = settingsRef.current.jumpForce
      g.isJumping = true
    }
  }, [])

  const activateBoost = useCallback(() => {
    const g = gameRef.current
    if (g.boostTimer <= 0) {
      g.boostTimer = 180 // 3 seconds at 60fps
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
    g.obstacles = []
    g.speed = s.baseSpeed
    g.distance = 0
    g.frameCount = 0
    g.legFrame = 0
    g.particles = []
    g.boostTimer = 0
    boostRef.current = false
    setBoostActive(false)
    setScore(0)
    setGameState('running')
  }, [difficulty])

  // Input handling
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (gameState === 'idle' || gameState === 'dead') {
          startGame()
        } else if (gameState === 'running') {
          jump()
        }
      }
      if (e.code === 'KeyB' && gameState === 'running') {
        activateBoost()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [gameState, startGame, jump, activateBoost])

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

      // Physics — boost = lower gravity, higher jump
      const grav = isBoosted ? s.gravity * 0.6 : s.gravity
      g.agentVY += grav
      g.agentY += g.agentVY
      if (g.agentY >= GROUND_Y - AGENT_H) {
        g.agentY = GROUND_Y - AGENT_H
        g.agentVY = 0
        g.isJumping = false
      }

      // Speed — boost = slowdown
      g.speed += s.speedIncrement
      const effectiveSpeed = isBoosted ? g.speed * 0.65 : g.speed
      g.distance += effectiveSpeed

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

      // Trail
      if (g.frameCount % 3 === 0) {
        g.particles.push({
          x: 50,
          y: g.agentY + AGENT_H / 2 + (Math.random() - 0.5) * 10,
          vx: -1 - Math.random(),
          vy: (Math.random() - 0.5) * 0.5,
          life: 0.6 + Math.random() * 0.4,
          color: isBoosted ? '#22D3EE' : '',
        })
      }

      // Collision
      const hitPad = isBoosted ? 8 : 4
      const agentBox = { x: 50 + hitPad, y: g.agentY + hitPad, w: AGENT_W - hitPad * 2, h: AGENT_H - hitPad }
      for (const o of g.obstacles) {
        const obsBox = { x: o.x, y: GROUND_Y - o.h, w: o.w, h: o.h }
        if (
          agentBox.x < obsBox.x + obsBox.w &&
          agentBox.x + agentBox.w > obsBox.x &&
          agentBox.y < obsBox.y + obsBox.h &&
          agentBox.y + agentBox.h > obsBox.y
        ) {
          for (let i = 0; i < 15; i++) {
            g.particles.push({
              x: 50 + AGENT_W / 2, y: g.agentY + AGENT_H / 2,
              vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
              life: 1, color: '#EF4444',
            })
          }
          const finalScore = Math.floor(g.distance / 10)
          setScore(finalScore)
          setHighScore((prev) => Math.max(prev, finalScore))
          setGameState('dead')
          return
        }
      }

      setScore(Math.floor(g.distance / 10))

      // ── DRAW ──
      if (!ctx) return
      const isDark = document.documentElement.classList.contains('dark')
      const bgColor = isDark ? '#09090B' : '#FAFAF8'
      const fgColor = isDark ? '#FAFAFA' : '#1A1A2E'
      const mutedColor = isDark ? '#71717A' : '#8E8E9A'
      const accentColor = isDark ? '#D97706' : '#B45309'
      const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,46,0.1)'

      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Boost tint
      if (isBoosted) {
        ctx.fillStyle = isDark ? 'rgba(34, 211, 238, 0.03)' : 'rgba(6, 182, 212, 0.04)'
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
      }

      // Ground
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke()

      // Grid
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
      for (let y = 60; y < GROUND_Y; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
      }

      // Particles
      g.particles.forEach((p) => {
        ctx.globalAlpha = p.life * 0.4
        ctx.fillStyle = p.color || accentColor
        const size = p.life * 4
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size)
      })
      ctx.globalAlpha = 1

      // Agent
      const agentColor = isBoosted ? '#22D3EE' : accentColor
      ctx.fillStyle = agentColor
      ctx.fillRect(50 + 4, g.agentY + 8, AGENT_W - 8, AGENT_H - 18)
      ctx.beginPath()
      ctx.arc(50 + AGENT_W / 2, g.agentY + 8, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = bgColor
      ctx.fillRect(50 + AGENT_W - 10, g.agentY + 5, 5, 5)
      ctx.strokeStyle = agentColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50 + AGENT_W / 2, g.agentY)
      ctx.lineTo(50 + AGENT_W / 2, g.agentY - 8)
      ctx.stroke()
      ctx.fillStyle = agentColor
      ctx.beginPath()
      ctx.arc(50 + AGENT_W / 2, g.agentY - 10, 3, 0, Math.PI * 2)
      ctx.fill()

      // Legs
      ctx.fillStyle = agentColor
      const legPhase = Math.sin(g.legFrame * 0.3)
      if (!g.isJumping) {
        ctx.fillRect(50 + 6, g.agentY + AGENT_H - 12, 5, 12 + legPhase * 3)
        ctx.fillRect(50 + AGENT_W - 11, g.agentY + AGENT_H - 12, 5, 12 - legPhase * 3)
      } else {
        ctx.fillRect(50 + 6, g.agentY + AGENT_H - 10, 5, 8)
        ctx.fillRect(50 + AGENT_W - 11, g.agentY + AGENT_H - 10, 5, 8)
      }

      // Obstacles — BIGGER labels with background pill
      g.obstacles.forEach((o) => {
        const obstacleY = GROUND_Y - o.h
        ctx.fillStyle = fgColor
        ctx.fillRect(o.x, obstacleY, o.w, o.h)
        ctx.fillStyle = '#dc2626'
        ctx.fillRect(o.x, obstacleY, o.w, 3)
        // Label
        ctx.font = 'bold 11px monospace'
        ctx.textAlign = 'center'
        const labelW = ctx.measureText(o.label).width + 8
        const labelX = o.x + o.w / 2
        const labelY = obstacleY - 12
        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
        ctx.beginPath()
        ctx.roundRect(labelX - labelW / 2, labelY - 10, labelW, 14, 3)
        ctx.fill()
        ctx.fillStyle = isDark ? '#E4E4E7' : '#3F3F46'
        ctx.fillText(o.label, labelX, labelY)
      })

      // HUD
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'left'
      ctx.fillStyle = agentColor
      ctx.fillText('AI RUNNER', 16, 22)
      ctx.font = '10px monospace'
      ctx.fillStyle = mutedColor
      ctx.fillText(settingsRef.current.label.toUpperCase(), 16, 36)

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
        ctx.fillText('press B for boost', CANVAS_W / 2, 22)
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [gameState, spawnObstacle, highScore])

  // Draw idle/dead
  useEffect(() => {
    if (gameState === 'running') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = document.documentElement.classList.contains('dark')
    const bgColor = isDark ? '#09090B' : '#FAFAF8'
    const fgColor = isDark ? '#FAFAFA' : '#1A1A2E'
    const mutedColor = isDark ? '#71717A' : '#8E8E9A'
    const accentColor = isDark ? '#D97706' : '#B45309'
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,46,0.1)'

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    ctx.strokeStyle = borderColor
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke()

    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
    for (let y = 60; y < GROUND_Y; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke()
    }

    // Agent
    ctx.fillStyle = accentColor
    ctx.fillRect(50 + 4, GROUND_Y - AGENT_H + 8, AGENT_W - 8, AGENT_H - 18)
    ctx.beginPath()
    ctx.arc(50 + AGENT_W / 2, GROUND_Y - AGENT_H + 8, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = bgColor
    ctx.fillRect(50 + AGENT_W - 10, GROUND_Y - AGENT_H + 5, 5, 5)
    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(50 + AGENT_W / 2, GROUND_Y - AGENT_H)
    ctx.lineTo(50 + AGENT_W / 2, GROUND_Y - AGENT_H - 8)
    ctx.stroke()
    ctx.fillStyle = accentColor
    ctx.beginPath()
    ctx.arc(50 + AGENT_W / 2, GROUND_Y - AGENT_H - 10, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(50 + 6, GROUND_Y - 12, 5, 12)
    ctx.fillRect(50 + AGENT_W - 11, GROUND_Y - 12, 5, 12)

    ctx.textAlign = 'center'
    if (gameState === 'idle') {
      ctx.font = '600 20px Georgia, serif'
      ctx.fillStyle = fgColor
      ctx.fillText('Press Space to Deploy', CANVAS_W / 2, GROUND_Y / 2 - 10)
      ctx.font = '11px monospace'
      ctx.fillStyle = mutedColor
      ctx.fillText('Dodge bugs, firewalls, latency & hallucinations', CANVAS_W / 2, GROUND_Y / 2 + 15)
      ctx.fillText('B = boost  \u00B7  Space = jump', CANVAS_W / 2, GROUND_Y / 2 + 35)
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
        <span>Space to jump &middot; B for boost &middot; Click or tap works too</span>
        {highScore > 0 && <span>Best: {highScore}</span>}
      </div>
    </div>
  )
}
