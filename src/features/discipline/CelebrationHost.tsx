import { useEffect, useRef, useState } from 'react'

export interface CelebratePayload {
  title: string
  subtitle?: string
  xp?: number
  confetti?: boolean
}

interface ToastItem extends CelebratePayload {
  id: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  rotation: number
  vRot: number
}

const CELEBRATE_EVENT = 'ielts:celebrate'
const CONFETTI_COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f472b6', '#38bdf8']

export function triggerCelebration(payload: CelebratePayload) {
  window.dispatchEvent(new CustomEvent<CelebratePayload>(CELEBRATE_EVENT, { detail: payload }))
}

export function CelebrationHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const startLoop = () => {
      if (rafRef.current !== null) return
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const step = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = window.innerWidth
        const h = window.innerHeight
        if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
          canvas.width = Math.floor(w * dpr)
          canvas.height = Math.floor(h * dpr)
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, w, h)

        particlesRef.current = particlesRef.current.filter(p => p.alpha > 0.02 && p.y < h + 24)
        for (const p of particlesRef.current) {
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.22
          p.vx *= 0.99
          p.rotation += p.vRot
          p.alpha *= 0.975

          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55)
          ctx.restore()
        }

        if (particlesRef.current.length > 0) {
          rafRef.current = window.requestAnimationFrame(step)
        } else {
          ctx.clearRect(0, 0, w, h)
          rafRef.current = null
        }
      }

      rafRef.current = window.requestAnimationFrame(step)
    }

    const burstConfetti = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const originX = window.innerWidth * 0.5
      const originY = Math.min(window.innerHeight * 0.24, 180)

      for (let i = 0; i < 42; i++) {
        const angle = (Math.PI * 2 * i) / 42 + (Math.random() - 0.5) * 0.45
        const speed = 3.2 + Math.random() * 5.2
        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3.2,
          size: 5 + Math.random() * 5,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          alpha: 1,
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.24,
        })
      }
      startLoop()
    }

    const onCelebrate = (event: Event) => {
      const detail = (event as CustomEvent<CelebratePayload>).detail
      if (!detail) return
      const id = Date.now() + Math.random()
      setToasts(prev => [...prev.slice(-2), { ...detail, id }])
      if (detail.confetti !== false) burstConfetti()

      window.setTimeout(() => {
        setToasts(prev => prev.filter(item => item.id !== id))
      }, 3600)
    }

    window.addEventListener(CELEBRATE_EVENT, onCelebrate)
    return () => {
      window.removeEventListener(CELEBRATE_EVENT, onCelebrate)
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="celebration-canvas" aria-hidden="true" />
      <div className="celebration-stack" role="status" aria-live="polite">
        {toasts.map(item => (
          <div key={item.id} className="celebration-toast">
            <div className="celebration-icon" aria-hidden="true">
              {item.xp ? `+${item.xp}` : '★'}
            </div>
            <div className="celebration-copy">
              <strong>{item.title}</strong>
              {item.subtitle && <span>{item.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
