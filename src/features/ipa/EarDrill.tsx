import { useState } from 'react'
import { pairs } from '../../data/ipa'
import { useStudy } from '../../app/StudyProvider'
import { shuffle } from '../../services/random'
import { speakWord } from '../../services/audio'
import { useEffect, useRef } from 'react'

export function EarDrill({ pair, done }: { pair: typeof pairs[number]; done: (correct: boolean) => void }) {
  const { state, complete } = useStudy()
  const [index] = useState(() => Math.floor(Math.random() * 2))
  const [order] = useState(() => shuffle([0, 1]))
  const [selected, setSelected] = useState<number | null>(null)
  const [played, setPlayed] = useState(false)
  const [error, setError] = useState('')
  const playbackTimeout = useRef<number | undefined>(undefined)
  const word = pair.words[index]
  useEffect(() => () => window.clearTimeout(playbackTimeout.current), [])
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
        setPlayed(true)
        setError('Thiết bị không báo khi phát xong. Bạn vẫn có thể chọn đáp án hoặc nghe lại.')
      }, 2500)
      speakWord(word, state.accent, state.rate, { end: finishPlayback, boundary: finishPlayback, error: message => { finishPlayback(); setError(message) } })
    }}>Phát từ bí mật</button>
      {order.map(choice => <button key={pair.words[choice]} disabled={!played || selected !== null} onClick={() => {
        setSelected(choice)
        complete('ipa', choice === index ? 8 : 2, 0, choice === index ? [] : [{
          id: 'ipa:' + pair.words.join(':'), domain: 'ipa', prompt: 'Phân biệt /' + pair.sounds.join('/ và /') + '/',
          answer: pair.words.join(' · ')
        }])
      }}>{pair.words[choice]}</button>)}
    </div>
    {error && <p role="status" className="error">{error}</p>}
    {selected !== null && <><p role="status" className={selected === index ? 'answer' : 'error'}>{selected === index ? 'Chính xác' : 'Đáp án'} · {word}</p>
      <button onClick={() => done(selected === index)}>Tiếp tục</button></>}
  </div>
}
