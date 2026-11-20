import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useStudy } from '../app/StudyProvider'
import { minimumWork } from '../features/discipline/study-credit'
import { shuffle } from '../services/random'
import { Listen } from '../components/Audio'
import { Flashcard, VerbDrill } from '../features/verbs/VerbDrill'
import { verbExample, verbGroup, verbs, type Verb } from '../features/verbs/verbs'

export default function Verbs() {
  const { complete } = useStudy()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [group, setGroup] = useState('')
  const [mode, setMode] = useState<'library' | 'flash' | 'typing' | 'cloze'>('library')
  const [order, setOrder] = useState(verbs)
  const [position, setPosition] = useState(0)
  const [round, setRound] = useState(0)
  const [session, setSession] = useState<Verb[]>([])
  const [sessionScore, setSessionScore] = useState(0)
  const [revealed, setRevealed] = useState<number[]>([])
  const filtered = (mode === 'library' ? verbs : order).filter(verb => (!group || group === verbGroup(verb) || group === 'ought' && /[oa]ught$/.test(verb.past) || group === 'iau' && /i/.test(verb.base) && /a/.test(verb.past) && /u/.test(verb.part))
    && [verb.base, verb.past, verb.part, verb.meaning].some(value => value.toLowerCase().includes(query.toLowerCase().trim())))
  const verb = session.length ? session[position] : filtered[position % (filtered.length || 1)]
  function startSession(nextMode: typeof mode) {
    const shuffled = shuffle(verbs)
    const matchesGroup = (entry: Verb) => !group || group === verbGroup(entry) || group === 'ought' && /[oa]ught$/.test(entry.past) || group === 'iau' && /i/.test(entry.base) && /a/.test(entry.past) && /u/.test(entry.part)
    const candidates = (nextMode === 'library' ? verbs : shuffled).filter(entry => matchesGroup(entry)
      && [entry.base, entry.past, entry.part, entry.meaning].some(value => value.toLowerCase().includes(query.toLowerCase().trim())))
    const queue = Array.from({ length: 20 }, (_, index) => candidates[index % candidates.length]).filter(Boolean)
    setMode(nextMode)
    setOrder(shuffled)
    setSession(shuffle(queue))
    setPosition(0)
    setSessionScore(0)
    setRevealed([])
    setRound(value => value + 1)
  }
  function move(direction: number) {
    setPosition(value => session.length ? Math.max(0, Math.min(session.length, value + direction)) : (value + direction + filtered.length) % filtered.length)
    setRound(value => value + 1)
  }
  return <>
    <header className="page-head"><p className="overline">TỪ VỰNG</p><h1>Động từ bất quy tắc</h1><p>Luyện {verbs.length} động từ theo quy luật biến đổi và ngữ cảnh.</p></header>
    <section className="panel stack">
      <div className="row">
        <input type="search" aria-label="Tìm động từ" placeholder="Tìm động từ hoặc nghĩa" value={query} onChange={event => { setQuery(event.target.value); setPosition(0); setSession([]) }} />
        <select aria-label="Nhóm biến đổi" value={group} onChange={event => { setGroup(event.target.value); setPosition(0); setSession([]) }}>
          <option value="">Tất cả nhóm</option>{['AAA','ABB','ABA','AAB','ABC'].map(value => <option key={value}>{value}</option>)}
          <option value="ought">-ought / -aught</option><option value="iau">i–a–u</option>
        </select>
      </div>
      <div className="row">{([['library', 'Tra cứu'], ['flash', 'Flashcard'], ['typing', 'Gõ nhanh'], ['cloze', 'Điền ngữ cảnh']] as const).map(([value, label]) =>
        <button key={value} aria-pressed={mode === value} onClick={() => value === 'library' ? setMode('library') : startSession(value)}>{label}</button>)}{mode !== 'library' && <button onClick={() => startSession(mode)}>Trộn lại 20 lượt</button>}</div>
      {mode !== 'library' && session.length > 0 && position < session.length && <div className="between"><span className="pill">{position + 1}/20</span><span className="muted">Lượt luyện · câu sai vào sổ ôn</span></div>}
      {mode !== 'library' && session.length === 0 && <p>Chưa có lượt luyện đang chạy. <button className="primary" onClick={() => startSession(mode)}>Bắt đầu 20 lượt</button></p>}
      {mode !== 'library' && position >= session.length && session.length > 0 && <div role="status" className="lesson-rule stack"><p>{mode === 'flash' ? <>Đã lật <strong>{revealed.length}/{session.length} thẻ</strong>.{revealed.length < minimumWork(session.length) && ' Chưa đủ để giữ chuỗi.'}</> : <>Hoàn thành <strong>{session.length} lượt</strong>. Số câu đúng: <strong>{sessionScore}/{session.length}</strong>.</>}</p><button className="primary" onClick={() => startSession(mode)}>Luyện lại 20 lượt</button></div>}
      {!filtered.length && <p>Không tìm thấy động từ phù hợp.</p>}
      {verb && mode === 'flash' && position < session.length && <Flashcard key={verb.base + round} verb={verb} move={move} onReveal={() => {
        if (revealed.includes(position)) return
        setRevealed(previous => [...previous, position])
        complete('verbs', 3, 0, [], revealed.length + 1 >= minimumWork(session.length))
      }} />}
      {verb && (mode === 'typing' || mode === 'cloze') && position < session.length && <VerbDrill key={mode + verb.base + round} verb={verb} mode={mode} qualifies={position + 1 >= minimumWork(session.length)} done={correct => { setSessionScore(value => value + Number(correct)); move(1) }} />}
      {mode === 'library' && <div className="catalog verb-catalog">{filtered.map(item => <article className="catalog-item" key={item.base} id={'verb-' + item.base}>
        <div className="between"><h2>{item.base}</h2><span className="pill">{verbGroup(item)} · {item.level}</span></div>
        <p>{item.meaning}</p>
        <div className="forms">{[item.base, item.past, item.part].map((form, index) => <div key={index}><strong>V{index + 1} · {form}</strong><small>/{item.ipa[index]}/</small><Listen text={item.base === 'read' && index > 0 ? 'red' : form.replaceAll('/', ', ')} /></div>)}</div>
        <p>{verbExample(item)} <Listen text={verbExample(item)} /></p>
      </article>)}</div>}
    </section>
  </>
}
