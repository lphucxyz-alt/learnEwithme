import { useEffect, useRef } from 'react'

const idleLimit = 180_000

export function useExamTime(deadline: number | undefined, save: (time: number) => void) {
  const readPending = useRef<() => number>(() => 0)
  useEffect(() => {
    if (deadline === undefined) return
    const end = deadline
    let lastSample = Date.now()
    let engagedUntil = lastSample + idleLimit
    let pending = 0
    let visible = document.visibilityState === 'visible' && document.hasFocus()

    function sample(now: number) {
      if (visible) pending += Math.max(0, Math.min(now, end, engagedUntil) - lastSample)
      lastSample = now
    }
    function takePending() {
      sample(Date.now())
      const elapsed = pending
      pending = 0
      return elapsed
    }
    function checkpoint() {
      const time = takePending()
      if (time > 0) save(time)
    }
    function noteInteraction() {
      const now = Date.now()
      sample(now)
      engagedUntil = now + idleLimit
    }
    function updateVisibility() {
      checkpoint()
      visible = document.visibilityState === 'visible' && document.hasFocus()
      if (visible) engagedUntil = Date.now() + idleLimit
    }

    readPending.current = takePending
    const timer = window.setInterval(checkpoint, 5000)
    const interactions = ['pointerdown', 'keydown', 'scroll'] as const
    for (const kind of interactions) window.addEventListener(kind, noteInteraction, { capture: true, passive: true })
    document.addEventListener('visibilitychange', updateVisibility)
    window.addEventListener('blur', updateVisibility)
    window.addEventListener('focus', updateVisibility)
    window.addEventListener('pagehide', checkpoint)
    return () => {
      checkpoint()
      readPending.current = () => 0
      window.clearInterval(timer)
      for (const kind of interactions) window.removeEventListener(kind, noteInteraction, true)
      document.removeEventListener('visibilitychange', updateVisibility)
      window.removeEventListener('blur', updateVisibility)
      window.removeEventListener('focus', updateVisibility)
      window.removeEventListener('pagehide', checkpoint)
    }
  }, [deadline, save])
  return () => readPending.current()
}
