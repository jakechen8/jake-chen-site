'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CANVAS_W = 800
const CANVAS_H = 300
const GROUND_Y = 240
const GRAVITY = 0.7
const JUMP_FORCE = -13
const AGENT_W = 30
const AGENT_H = 40
const BASE_SPEED = 4
const SPEED_INCREMENT = 0.001

interface Obstacle {
  x: number
  w: number
  h: number
  type: 'bug' | 'firewall' | 'latency' | 'hallucination'
  label: string
}

export default function AIRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'idle' | 'running' | 'dead'>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const gameRef = useRef({
    agentY: GROUND_Y - AGENT_H,
    agentVY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    speed: BASE_SPEED,
    distance: 0,
    frameCount: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number }[],
  })

  const spawnObstacle = useCallback(() => {
    const types: Obstacle['type'][] = ['bug', 'firewall', 'latency', 'hallucination']
    const labels: Record<Obstacle['type'], string> = {
      bug: 'BUG',
      firewall: 'FIREWALL',
      latency: 'LATENCY',
      hallucination: 'HALLUC.',
    }
    const type = types[Math.floor(Math.random() * types.length)]
    const h = 25 + Math.random() * 35
    const w = 20 + Math.random() * 20
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
      g.agentVY = JUMP_FORCE
      g.isJumping = true
    }
  }, [])

  const startGame = useCallback(() => {
    const g = gameRef.current
    g.agentY = GROUND_Y - AGENT_H
    g.agentVY = 0
    g.isJumping = false
    g.obstacles = []
    g.speed = BASE_SPEED
    g.distance = 0
    g.frameCount = 0
    g.particles = []
    setScore(0)
    setGameState('running')
  }, [])

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
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [gameState, startGame, jump])

  // Touch handling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    function handleTouch(e: TouchEvent) {
      e.preventDefault()
      if (gameState === 'idle' || gameState === 'dead') {
        startGame()
      } else if (gameState === 'running') {
        jump()
      }
    }
    canvas.addEventListener('touchstart', handleTouch, { passive: false })
    return () => canvas.removeEventListener('touchstart', handleTouch)
  }, [gameState, startGame, jump])

  // Game loop
  useEffect(() => {
    if (gameState !== 'running') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number

    function loop() {
      const g = gameRef.current
      g.frameCount++

      // Physics
      g.agentVY += GRAVITY
      g.agentY += g.agentVY
      if (g.agentY >= GROUND_Y - AGENT_H) {
        g.agentY = GROUND_Y - AGENT_H
        g.agentVY = 0
        g.isJumping = false
      }

      // Speed up
      g.speed += SPEED_INCREMENT
      g.distance += g.speed

      // Spawn obstacles
      if (g.frameCount % Math.max(50, 100 - Math.floor(g.distance / 500)) === 0) {
        spawnObstacle()
      }

      // Move obstacles
      g.obstacles.forEach((o) => (o.x -= g.speed))
      g.obstacles = g.obstacles.filter((o) => o.x + o.w > -50)

      // Particles
      g.particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.03
      })
      g.particles = g.particles.filter((p) => p.life > 0)

      // Trail particles
      if (g.frameCount % 3 === 0) {
        g.particles.push({
          x: 50,
          y: g.agentY + AGENT_H / 2 + (Math.random() - 0.5) * 10,
          vx: -1 - Math.random(),
          vy: (Math.random() - 0.5) * 0.5,
          life: 0.6 + Math.random() * 0.4,
        })
      }

      // Collision detection
      const agentBox = { x: 50 + 4, y: g.agentY + 4, w: AGENT_W - 8, h: AGENT_H - 4 }
      for (const o of g.obstacles) {
        const obsBox = { x: o.x, y: GROUND_Y - o.h, w: o.w, h: o.h }
        if (
          agentBox.x < obsBox.x + obsBox.w &&
          agentBox.x + agentBox.w > obsBox.x &&
          agentBox.y < obsBox.y + obsBox.h &&
          agentBox.y + agentBox.h > obsBox.y
        ) {
          // Death
          for (let i = 0; i < 15; i++) {
            g.particles.push({
              x: 50 + AGENT_W / 2,
              y: g.agentY + AGENT_H / 2,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 1,
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

      // DRAW
      if (!ctx) return
      const isDark = document.documentElement.classList.contains('dark')
      const bgColor = isDark ? '#09090B' : '#FAFAF8'
      const fgColor = isDark ? '#FAFAFA' : '#1A1A2E'
      const mutedColor = isDark ? '#71717A' : '#8E8E9A'
      const accentColor = isDark ? '#D97706' : '#B45309'
      const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,26,46,0.1)'

      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Ground
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, GROUND_Y)
      ctx.lineTo(CANVAS_W, GROUND_Y)
      ctx.stroke()

      // Grid lines (subtle)
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
      for (let y = 60; y < GROUND_Y; y += 60) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(CANVAS_W, y)
        ctx.stroke()
      }

      // Particles (trail)
      g.particles.forEach((p) => {
        ctx.globalAlpha = p.life * 0.4
        ctx.fillStyle = accentColor
        const size = p.life * 4
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size)
      })
      ctx.globalAlpha = 1

      // Agent (robot)
      ctx.fillStyle = accentColor
      ctx.fillRect(50, g.agentY, AGENT_W, AGENT_H)
      // Eye
      ctx.fillStyle = bgColor
      ctx.fillRect(50 + AGENT_W - 12, g.agentY + 8, 6, 6)
      // Antenna
      ctx.strokeStyle = accentColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50 + AGENT_W / 2, g.agentY)
      ctx.lineTo(50 + AGENT_W / 2, g.agentY - 8)
      ctx.stroke()
      ctx.fillStyle = accentColor
      ctx.beginPath()
      ctx.arc(50 + AGENT_W / 2, g.agentY - 10, 3, 0, Math.PI * 2)
      ctx.fill()

      // Obstacles
      g.obstacles.forEach((o) => {
        const obstacleY = GROUND_Y - o.h
        ctx.fillStyle = fgColor
        ctx.fillRect(o.x, obstacleY, o.w, o.h)
        // Hazard stripes
        ctx.fillStyle = isDark ? '#dc2626' : '#dc2626'
        ctx.fillRect(o.x, obstacleY, o.w, 3)
        // Label
        ctx.font = '8px "JetBrains Mono", monospace'
        ctx.fillStyle = mutedColor
        ctx.textAlign = 'center'
        ctx.fillText(o.label, o.x + o.w / 2, obstacleY - 5)
      })

      // Score
      ctx.font = '14px "JetBrains Mono", monospace'
      ctx.fillStyle = mutedColor
      ctx.textAlign = 'right'
      ctx.fillText(`DISTANCE: ${Math.floor(g.distance / 10)}`, CANVAS_W - 16, 30)
      ctx.fillText(`SPEED: ${g.speed.toFixed(1)}x`, CANVAS_W - 16, 48)

      // Left label
      ctx.textAlign = 'left'
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.fillStyle = accentColor
      ctx.fillText('AI RUNNER', 16, 24)
      ctx.fillStyle = mutedColor
      ctx.font = '9px "JetBrains Mono", monospace'
      ctx.fillText('DEPLOYING AGENT...', 16, 38)

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [gameState, spawnObstacle])

  // Draw idle/dead state
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

    // Ground
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y)
    ctx.lineTo(CANVAS_W, GROUND_Y)
    ctx.stroke()

    // Grid
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
    for (let y = 60; y < GROUND_Y; y += 60) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(CANVAS_W, y)
      ctx.stroke()
    }

    // Agent idle
    ctx.fillStyle = accentColor
    ctx.fillRect(50, GROUND_Y - AGENT_H, AGENT_W, AGENT_H)
    ctx.fillStyle = bgColor
    ctx.fillRect(50 + AGENT_W - 12, GROUND_Y - AGENT_H + 8, 6, 6)
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

    // Center text
    ctx.textAlign = 'center'
    if (gameState === 'idle') {
      ctx.font = '600 20px "Playfair Display", Georgia, serif'
      ctx.fillStyle = fgColor
      ctx.fillText('Press Space to Deploy', CANVAS_W / 2, GROUND_Y / 2 - 10)
      ctx.font = '11px "JetBrains Mono", monospace'
      ctx.fillStyle = mutedColor
      ctx.fillText('Dodge bugs, firewalls, latency & hallucinations', CANVAS_W / 2, GROUND_Y / 2 + 15)
    } else {
      ctx.font = '600 20px "Playfair Display", Georgia, serif'
      ctx.fillStyle = '#dc2626'
      ctx.fillText('Model Crashed', CANVAS_W / 2, GROUND_Y / 2 - 20)
      ctx.font = '14px "JetBrains Mono", monospace'
      ctx.fillStyle = fgColor
      ctx.fillText(`Distance: ${score}`, CANVAS_W / 2, GROUND_Y / 2 + 10)
      if (highScore > 0) {
        ctx.fillStyle = accentColor
        ctx.fillText(`Best: ${highScore}`, CANVAS_W / 2, GROUND_Y / 2 + 32)
      }
      ctx.font = '11px "JetBrains Mono", monospace'
      ctx.fillStyle = mutedColor
      ctx.fillText('Press Space to Redeploy', CANVAS_W / 2, GROUND_Y / 2 + 58)
    }

    // Label
    ctx.textAlign = 'left'
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.fillStyle = accentColor
    ctx.fillText('AI RUNNER', 16, 24)
  }, [gameState, score, highScore])

  return (
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
  )
}
