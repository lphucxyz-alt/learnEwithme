import { useEffect, useRef, useState } from 'react'
import type { Sound } from '../../data/ipa'
import { getArticulation, initialFrame, placeLabels } from './articulation'
import { FrontMouth } from './FrontMouth'
import { Mouth } from './Mouth'
import { IpaCamera } from './IpaCamera'

const views = [['front', 'Bên ngoài'], ['side', 'Mặt cắt'], ['both', 'Cả hai']] as const
export type ArticulationView = typeof views[number][0]
const airLabels = { none: 'Nghỉ', nose: 'Qua mũi', blocked: 'Đang chặn', mouth: 'Qua miệng', sides: 'Hai bên lưỡi' }
const durationMs = 2450

export function ArticulationLab({ sound, view, setView }: { sound: Sound; view: ArticulationView; setView: (view: ArticulationView) => void }) {
  const [frame, setFrame] = useState(initialFrame)
  const [playing, setPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const frameRef = useRef(initialFrame)
  const started = useRef(false)
  const articulation = getArticulation(sound, frame)

  function seek(next: number) {
    frameRef.current = next
    setFrame(next)
  }

  useEffect(() => {
    if (!playing) return
    const offset = frameRef.current
    const start = performance.now()
    let request = 0
    function tick(now: number) {
      const position = offset + (now - start) / durationMs * 100
      if (position < 100) {
        seek(position)
        request = requestAnimationFrame(tick)
      } else if (loop) {
        seek(position % 100)
        request = requestAnimationFrame(tick)
      } else {
        seek(100)
        setPlaying(false)
      }
    }
    request = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(request)
  }, [loop, playing])

  const lipText = articulation.pose.lipBite ? 'Răng trên tựa môi dưới'
    : articulation.pose.round > .3 ? 'Tròn môi' : articulation.pose.spread > .5 ? 'Kéo nhẹ khóe môi'
      : articulation.pose.opening === 0 ? 'Khép môi' : 'Thả lỏng'
  const jawText = articulation.pose.opening === 0 ? 'Khép' : articulation.pose.opening >= .7 ? 'Mở rộng' : articulation.pose.opening >= .4 ? 'Mở vừa' : 'Mở hẹp'

  return <div className="ipa-articulation stack">
    <div className="between">
      <div className="row ipa-view-switch" role="group" aria-label="Góc nhìn khẩu hình">
        {views.map(([key, label]) => <button type="button" key={key} aria-pressed={key === view} onClick={() => setView(key)}>{label}</button>)}
      </div>
      <span className="ipa-phase">{articulation.phase}</span>
    </div>
    <div className="ipa-models" data-view={view}>
      {view !== 'side' && <figure className="ipa-model ipa-model-front">
        <figcaption><strong>Nhìn chính diện</strong><small>Môi và hàm dưới</small></figcaption>
        <FrontMouth articulation={articulation} symbol={sound.symbol} />
      </figure>}
      {view !== 'front' && <figure className="ipa-model ipa-model-side">
        <figcaption><strong>Bên trong miệng</strong><small>Lưỡi, ngạc và đường hơi</small></figcaption>
        <Mouth articulation={articulation} symbol={sound.symbol} playing={playing} />
      </figure>}
    </div>
    <div className="ipa-motion-controls">
      <div className="row">
        <button type="button" className="ipa-motion-button" onClick={() => {
          if (playing) { setPlaying(false); return }
          if (!started.current || frameRef.current >= 100) seek(0)
          started.current = true
          setPlaying(true)
        }}>{playing ? 'Tạm dừng' : 'Xem chuyển động'}</button>
        <label className="ipa-loop"><input type="checkbox" checked={loop} onChange={event => setLoop(event.target.checked)} /> Lặp lại</label>
      </div>
      <label className="ipa-scrubber"><span className="sr-only">Tiến độ minh họa khẩu hình</span>
        <input aria-label="Tiến độ minh họa khẩu hình" aria-valuetext={articulation.phase} type="range" min={0} max={100} value={Math.round(frame)} onChange={event => {
          setPlaying(false)
          started.current = true
          seek(Number(event.currentTarget.value))
        }} />
      </label>
    </div>
    <dl className="ipa-articulation-notes">
      <div><dt>Môi và hàm</dt><dd>{lipText} · {jawText.toLowerCase()}</dd></div>
      <div><dt>Vị trí cấu âm</dt><dd>{placeLabels[articulation.place]}</dd></div>
      <div><dt>Luồng hơi</dt><dd>{airLabels[articulation.flow]}</dd></div>
      <div><dt>Dây thanh</dt><dd>{articulation.voiced ? 'Rung' : 'Không rung'}</dd></div>
    </dl>
    <IpaCamera />
  </div>
}
