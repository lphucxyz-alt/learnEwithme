import { useEffect, useRef, useState } from 'react'
import type { pairs } from '../../data/ipa'
import { useStudy } from '../../app/StudyProvider'
import { shuffle } from '../../services/random'
import { stopAudio } from '../../services/audio'
import { playIpaWord } from './ipa-audio'

export function EarDrill({ pair, done, qualifies, onAnswer }: {
  pair: typeof pairs[number]; done: (correct: boolean) => void; qualifies: boolean; onAnswer?: (correct: boolean) => void
}) {
  const { state, complete } = useStudy()
  const [index] = useState(() => Math.floor(Math.random() * 2))
  const [order] = useState(() => shuffle([0, 1]))
  const [selected, setSelected] = useState<number | null>(null)
  const [played, setPlayed] = useState(false)
  const [error, setError] = useState('')
  const playbackTimeout = useRef<number | undefined>(undefined)
  const word = pair.words[index]
  useEffect(() => () => {
    if (playbackTimeout.current !== undefined) stopAudio()
    window.clearTimeout(playbackTimeout.current)
  }, [])
  function finishPlayback() {
    window.clearTimeout(playbackTimeout.current)
    setPlayed(true)
    setError('')
  }
  return <div className="stack">
    <p>Nghe và chọn từ đúng trong cặp /{pair.sounds.join('/ · /')}/.</p>
    <div className="row"><button className="primary" onClick={() => {
      setError('')
      setPlayed(false)
      window.clearTimeout(playbackTimeout.current)
      playbackTimeout.current = window.setTimeout(() => {
        setError('Chưa xác nhận được âm thanh. Hãy phát lại hoặc đổi cặp âm.')
      }, 4500)
      playIpaWord(word, state.accent, state.rate, { end: finishPlayback, error: message => {
        window.clearTimeout(playbackTimeout.current)
        setError(message)
      } })
    }}>Phát từ bí mật</button>
      {order.map(choice => <button key={pair.words[choice]} disabled={!played || selected !== null} onClick={() => {
        setSelected(choice)
        complete('ipa', choice === index ? 8 : 2, 0, choice === index ? [] : [{
          id: 'ipa:' + pair.words.join(':'), domain: 'ipa', prompt: 'Phân biệt /' + pair.sounds.join('/ và /') + '/',
          answer: pair.words.join(' · ')
        }], qualifies)
        onAnswer?.(choice === index)
      }}>{pair.words[choice]}</button>)}
    </div>
    {error && <p role="status" className="error">{error}</p>}
    {selected !== null && <><p role="status" className={selected === index ? 'answer' : 'error'}>{selected === index ? 'Chính xác' : 'Đáp án'} · {word}</p>
      <button onClick={() => done(selected === index)}>Tiếp tục</button></>}
  </div>
}
