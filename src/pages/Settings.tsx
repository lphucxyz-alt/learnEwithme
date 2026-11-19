import { useState } from 'react'
import { useStudy } from '../app/StudyProvider'
import { parseBackup } from '../services/storage'
import { dayKey } from '../features/discipline/activity'
import type { StudyState } from '../types/study'

export default function Settings() {
  const { state, update } = useStudy()
  const [pending, setPending] = useState<StudyState | null>(null)
  const [notice, setNotice] = useState('')
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'ielts-backup-' + dayKey() + '.json'
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <>
    <header className="page-head"><h1>Cài đặt</h1><p>Tùy chỉnh mục tiêu, giao diện và bản sao lưu học tập.</p></header>
    <section className="panel stack"><h2>Hồ sơ luyện tập</h2>
      <label>Band mục tiêu<select value={state.targetBand} onChange={event => update(current => ({ ...current, targetBand: Number(event.target.value) }))}>
        {Array.from({ length: 11 }, (_, index) => 4 + index / 2).map(band => <option key={band} value={band}>{band.toFixed(1)}</option>)}
      </select></label>
      <label>Thời lượng tập trung mỗi phiên<select value={state.dailyMinutes} onChange={event => {
        const dailyMinutes = Number(event.target.value)
        const duration = dailyMinutes * 60
        update(current => ({ ...current, dailyMinutes, focus: current.focus.mode === 'work' && current.focus.deadline === null && current.focus.duration === current.focus.remaining
          ? { ...current.focus, duration, remaining: duration } : current.focus }))
      }}>{[5, 10, 15, 20, 25, 30, 45, 60, 90, 120].map(minutes => <option key={minutes} value={minutes}>{minutes} phút</option>)}</select></label>
      <label>Giao diện<select value={state.theme} onChange={event => update(current => ({ ...current, theme: event.target.value as StudyState['theme'] }))}>
        <option value="light">Sáng</option><option value="dark">Tối</option>
      </select></label>
    </section>
    <section className="panel stack"><h2>Sao lưu và khôi phục</h2><p>Chuyển tiến độ giữa thiết bị bằng tệp JSON.</p>
      <div className="row"><button className="primary" onClick={download}>Xuất bản sao lưu</button><label>Chọn bản sao lưu
        <input type="file" accept=".json,application/json" onChange={async event => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) return
          setPending(null)
          try {
            setPending(parseBackup(await file.text()))
            setNotice('Tệp hợp lệ. Khôi phục sẽ thay thế dữ liệu hiện tại.')
          } catch {
            setNotice('Tệp không đúng định dạng sao lưu IELTS Discipline OS.')
          }
        }} /></label></div>
      {notice && <p role="status">{notice}</p>}
      {pending && <div className="row"><button className="primary" onClick={() => {
        update(() => pending)
        setPending(null)
        setNotice('Đã khôi phục dữ liệu.')
      }}>Xác nhận khôi phục</button><button onClick={() => { setPending(null); setNotice('') }}>Hủy</button></div>}
    </section>
  </>
}
