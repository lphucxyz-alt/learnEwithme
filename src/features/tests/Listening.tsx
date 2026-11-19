import { useEffect, useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { speak, stopAudio } from '../../services/audio'

export function Listening({ turns, review = false }: { turns: { speaker: string; text: string }[]; review?: boolean }) {
  const { state } = useStudy()
  const [index, setIndex] = useState(-1)
  const [error, setError] = useState('')
  const speakers = [...new Set(turns.map(turn => turn.speaker))]
  useEffect(() => stopAudio, [])
  function play(position: number) {
    if (position === turns.length) { setIndex(-1); return }
    setIndex(position)
    const turn = turns[position]
    const alternate = state.accent === 'en-GB' ? 'en-US' : 'en-GB'
    speak(turn.text, speakers.indexOf(turn.speaker) % 2 ? alternate : state.accent, state.rate, {
      end: () => play(position + 1), error: message => { setError(message); setIndex(-1) }
    })
  }
  return <section className="panel stack">
    <h2>{review ? 'Transcript' : 'Hội thoại mô phỏng'}</h2>
    <div className="row"><button className="primary" onClick={() => { setError(''); play(0) }}>Phát từ đầu</button>
      <button disabled={index < 0} onClick={() => { stopAudio(); setIndex(-1) }}>Dừng</button>
      <span role="status">{error || (index >= 0 ? 'Đang phát lượt ' + (index + 1) + '/' + turns.length : 'Sẵn sàng phát')}</span></div>
    {review && <ol className="transcript">{turns.map((turn, position) => <li key={position} className={index === position ? 'spoken' : ''}>
      <strong>{turn.speaker}</strong> {turn.text} <button onClick={() => play(position)}>Nghe từ đây</button></li>)}</ol>}
  </section>
}
