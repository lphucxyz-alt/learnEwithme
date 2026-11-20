import { useEffect, useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { clockLabel, dayKey, record } from './activity'
import { triggerCelebration } from './CelebrationHost'

export function useNow() {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  return now
}

export function FocusTimer() {
  const { state, update } = useStudy()
  const { focus } = state
  const now = useNow()
  const seconds = focus.deadline === null ? focus.remaining : Math.max(0, Math.ceil((focus.deadline - now) / 1000))
  useEffect(() => {
    if (focus.deadline === null || seconds > 0) return
    update(previous => {
      const session = previous.focus
      if (session.deadline === null || session.deadline > Date.now()) return previous
      const work = session.mode === 'work'
      if (work) {
        triggerCelebration({
          xp: 0,
          title: 'Hoàn thành phiên Pomodoro',
          subtitle: 'Đã ghi thời gian tập trung. Bạn có thể nghỉ 5 phút.',
          confetti: false
        })
      }
      const duration = work ? 300 : previous.dailyMinutes * 60
      const updated = work ? record(previous, 'focus', 0, session.duration, dayKey(new Date(session.deadline)), false) : previous
      return { ...updated, focus: { mode: work ? 'break' : 'work', duration, remaining: duration, deadline: null } }
    })
  }, [focus.deadline, seconds, update])
  return <div className="focus row">
    <span><span className="muted">{focus.mode === 'work' ? 'Tập trung' : 'Nghỉ'} </span><strong>{clockLabel(seconds)}</strong></span>
    <button onClick={() => {
      const timestamp = Date.now()
      update(previous => previous.focus.deadline !== null && previous.focus.deadline <= timestamp ? previous : ({ ...previous, focus: previous.focus.deadline === null
        ? { ...previous.focus, deadline: timestamp + previous.focus.remaining * 1000 }
        : { ...previous.focus, deadline: null, remaining: Math.max(1, Math.ceil((previous.focus.deadline - timestamp) / 1000)) } }))
    }}>{focus.deadline ? 'Tạm dừng' : 'Bắt đầu'}</button>
  </div>
}
