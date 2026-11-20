import { useEffect, useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import type { Sound } from '../../data/ipa'
import { ipaExamples, soundPosition, splitPhones, type SoundPosition } from '../../data/ipa-words'
import { stopAudio } from '../../services/audio'
import { playIpaWord } from './ipa-audio'
import { IpaListen } from './IpaListen'
import { shuffle } from '../../services/random'
import { minimumWork } from '../discipline/study-credit'

type Mode = 'position' | 'dictation'
const positions: SoundPosition[] = ['đầu', 'giữa', 'cuối']
const modeLabels: Record<Mode, string> = { position: 'Tìm vị trí âm', dictation: 'Nghe và chép từ' }

function WordTranscription({ value, symbol }: { value: string; symbol: string }) {
  return <span className="ipa-word-transcription" aria-label={value}>/
    {splitPhones(value, true).map((phone, index) => phone === symbol
      ? <mark key={index}>{phone}</mark>
      : <span key={index}>{phone}</span>)}/
  </span>
}

export function IpaWordPractice({ sound, learnNext, nextSymbol }: { sound: Sound; learnNext: () => void; nextSymbol?: string }) {
  const { state, update, complete } = useStudy()
  const examples = ipaExamples[sound.symbol]
  const [mode, setMode] = useState<Mode>('position')
  const [queue, setQueue] = useState<typeof examples>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [position, setPosition] = useState<SoundPosition>()
  const [answer, setAnswer] = useState('')
  const [graded, setGraded] = useState<boolean>()
  const [heard, setHeard] = useState(false)
  const [audioError, setAudioError] = useState('')
  const item = queue[index]
  const answerPosition = item ? soundPosition(splitPhones(item[1]), sound.symbol) : undefined
  const running = Boolean(item)
  const done = queue.length > 0 && !item
  const required = minimumWork(queue.length)

  useEffect(() => stopAudio, [])

  function start() {
    stopAudio()
    setQueue(shuffle(examples))
    setIndex(0)
    setScore(0)
    resetStep()
  }

  function resetStep() {
    setPosition(undefined)
    setAnswer('')
    setGraded(undefined)
    setHeard(false)
    setAudioError('')
  }

  function hearWord() {
    if (!item) return
    setAudioError('')
    setHeard(false)
    playIpaWord(item[0], 'en-GB', state.rate, { end: () => setHeard(true), error: setAudioError })
  }

  function grade() {
    if (!item || graded !== undefined || (mode === 'position' ? !position : !heard || !answer.trim())) return
    const correct = mode === 'position' ? position === answerPosition : answer.trim().toLowerCase() === item[0].toLowerCase()
    const nextScore = score + Number(correct)
    setGraded(correct)
    setScore(nextScore)
    const reviewed = index + 1
    complete('ipa', correct ? 7 : 2, 0, correct ? [] : [{
      id: `ipa-word:${sound.symbol}:${item[0]}`, domain: 'ipa', prompt: `Âm /${sound.symbol}/ nằm ở đâu trong từ “${item[0]}”?`,
      answer: `/${item[1]}/ · Ở ${answerPosition} từ.`
    }], reviewed >= required)
    if (reviewed === queue.length && nextScore >= required) update(previous => {
      if (previous.ipaLearned.includes(sound.symbol)) return previous
      return { ...previous, ipaLearned: [...previous.ipaLearned, sound.symbol] }
    })
  }

  return <section className="panel ipa-word-lesson stack" id="ipa-words" tabIndex={-1} aria-labelledby="ipa-word-heading">
    <div className="between"><h2 id="ipa-word-heading">Luyện với từ chứa /{sound.symbol}/</h2>
      {state.ipaLearned.includes(sound.symbol) && <span className="ipa-learned">✓ Đã luyện</span>}
    </div>
    {!running && <ul className="ipa-word-list">
      {examples.map(([word, ipa, meaning]) => <li key={word}>
        <div><strong lang="en">{word}</strong> <WordTranscription value={ipa} symbol={sound.symbol} /><small>{meaning}</small></div>
        <IpaListen text={word} label={'Nghe ' + word} />
      </li>)}
    </ul>}
    {!running && !done && <div className="row" role="group" aria-label="Cách luyện IPA">
      {(['position', 'dictation'] as const).map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{modeLabels[value]}</button>)}
      <button type="button" className="primary" onClick={start}>Bắt đầu {examples.length} câu</button>
    </div>}
    {item && <form className="ipa-word-quiz stack" onSubmit={event => {
      event.preventDefault()
      if (graded === undefined) grade()
      else {
        stopAudio()
        setIndex(index + 1)
        resetStep()
      }
    }}>
      <div className="between"><h3>{modeLabels[mode]}</h3><small>{index + 1}/{queue.length}</small></div>
      {mode === 'position'
        ? <p>Trong tiếng Anh–Anh, âm /{sound.symbol}/ nằm ở đâu trong từ <strong lang="en">{item[0]}</strong>?</p>
        : <p>Nghe giọng Anh–Anh rồi gõ từ bạn nghe được.</p>}
      <button type="button" onClick={hearWord}>Nghe từ</button>
      {audioError && <p role="status" className="error">{audioError}</p>}
      {mode === 'position' && <div className="row" role="group" aria-label="Vị trí trong từ">
        {positions.map(value => <button type="button" key={value} aria-pressed={value === position} disabled={graded !== undefined} onClick={() => setPosition(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)} từ
        </button>)}
      </div>}
      {mode === 'dictation' && <label>Từ bạn nghe <input value={answer} spellCheck={false} autoComplete="off" autoCapitalize="none"
        disabled={graded !== undefined} onChange={event => setAnswer(event.target.value)} /></label>}
      {graded !== undefined && <p role="status" className={graded ? 'answer' : 'error'}>
        {graded ? 'Chính xác' : 'Đáp án'} · <strong>{item[0]}</strong> <WordTranscription value={item[1]} symbol={sound.symbol} /> · Âm ở {answerPosition} từ.
      </p>}
      <button className="primary" disabled={graded === undefined && (mode === 'position' ? !position : !heard || !answer.trim())}>
        {graded === undefined ? 'Chấm câu trả lời' : index + 1 === queue.length ? 'Xem kết quả' : 'Câu tiếp theo'}
      </button>
    </form>}
    {done && <div className="ipa-word-quiz stack">
      <p role="status">Đúng <strong>{score}/{queue.length}</strong> · {score >= required ? 'Đã lưu âm này vào tiến độ.' : 'Hãy nghe mẫu rồi thử lại để đạt ít nhất 2 câu đúng.'}</p>
      <div className="row">
        <button type="button" onClick={() => { stopAudio(); setQueue([]); resetStep() }}>Chọn cách luyện khác</button>
        {nextSymbol && <button type="button" className="primary" onClick={learnNext}>Học /{nextSymbol}/</button>}
      </div>
    </div>}
    <small>Phiên âm và đáp án theo mẫu Anh–Anh. Âm nghe bằng giọng Anh–Mỹ có thể khác.</small>
  </section>
}
