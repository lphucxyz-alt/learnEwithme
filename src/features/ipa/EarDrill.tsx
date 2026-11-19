import { useState } from 'react'
import { pairs } from '../../data/ipa'
import { useStudy } from '../../app/StudyProvider'
import { speakWord } from '../../services/audio'

export function EarDrill({ pair, done }: { pair: typeof pairs[number]; done: (correct: boolean) => void }) {
  const { state, complete } = useStudy()
  const [index] = useState(() => Math.floor(Math.random() * 2))
  const [selected, setSelected] = useState<number | null>(null)
  const [played, setPlayed] = useState(false)
  const [error, setError] = useState('')
  const word = pair.words[index]
  return <div className="stack">
    <p>Nghe và chọn từ đúng trong cặp /{pair.sounds.join('/ · /')}/.</p>
    <div className="row"><button className="primary" onClick={() => {
      setError('')
      speakWord(word, state.accent, state.rate, { end: () => setPlayed(true), boundary: () => setPlayed(true), error: setError })
    }}>Phát từ bí mật</button>
      {pair.words.map((item, choice) => <button key={item} disabled={!played || selected !== null} onClick={() => {
        setSelected(choice)
        complete('ipa', choice === index ? 8 : 2, 0, choice === index ? [] : [{
          id: 'ipa:' + pair.sounds.join(':'), domain: 'ipa', prompt: 'Phân biệt /' + pair.sounds.join('/ và /') + '/',
          answer: pair.words.join(' · ')
        }])
      }}>{item}</button>)}
    </div>
    {error && <p role="status" className="error">{error}</p>}
    {selected !== null && <><p role="status" className={selected === index ? 'answer' : 'error'}>{selected === index ? 'Chính xác' : 'Đáp án'} · {word}</p>
      <button onClick={() => done(selected === index)}>Tiếp tục</button></>}
  </div>
}
