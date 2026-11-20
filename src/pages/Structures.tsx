import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { Listen } from '../components/Audio'
import { structureCard, structures } from '../data/structures'
import { StructureDrill } from '../features/structures/StructureDrill'
import { shuffle } from '../services/random'

export default function Structures() {
  const [params, setParams] = useSearchParams()
  const [category, setCategory] = useState('')
  const [session, setSession] = useState<typeof structures>([])
  const [position, setPosition] = useState(0)
  const [score, setScore] = useState(0)
  const { state, complete } = useStudy()
  const filtered = structures.filter(item => !category || item.category === category)
  const item = filtered.find(entry => entry.id === params.get('id')) ?? filtered[0]
  const saved = Boolean(state.cards['structure:' + item.id])
  const quizPool = useMemo(() => filtered, [category])
  function startSession() {
    const queue = Array.from({ length: 20 }, (_, index) => quizPool[index % quizPool.length])
    setSession(shuffle(queue))
    setPosition(0)
    setScore(0)
  }
  return <>
    <header className="page-head"><p className="overline">WRITING & SPEAKING</p><h1>Kho cấu trúc IELTS</h1><p>So sánh cách diễn đạt và áp dụng ngay vào câu mới.</p></header>
    <div className="split">
      <section className="panel stack">
        <label>Nhóm bài<select value={category} onChange={event => { setCategory(event.target.value); setSession([]); setPosition(0); setScore(0) }}><option value="">Tất cả</option>
          {[...new Set(structures.map(entry => entry.category))].map(value => <option key={value}>{value}</option>)}</select></label>
        <div className="tiles">{filtered.map(entry => <button key={entry.id} aria-pressed={item.id === entry.id} onClick={() => setParams({ id: entry.id })}>{entry.title}</button>)}</div>
      </section>
      <section className="panel stack"><div className="between"><h2>{item.title}</h2><span className="pill">{item.category}</span></div>
        <p className="formula">{item.formula}</p>
        <div className="comparison">
          <div><span className="overline">Câu đơn giản</span><p>{item.basic}</p><Listen text={item.basic} /></div>
          <div><span className="overline">Cách nói rõ ý hơn</span><p>{item.upgraded}</p><Listen text={item.upgraded} /></div>
        </div>
        <p>{item.reason}</p>
        <button disabled={saved} onClick={() => complete('structures', 1, 0, [structureCard(item)], false)}>{saved ? 'Đã lưu vào sổ lỗi' : 'Đánh dấu khó'}</button>
      </section>
    </div>
    <section className="panel stack"><div className="between"><h2>Áp dụng cấu trúc</h2>{session.length > 0 && position < session.length && <span className="pill">{position + 1}/20</span>}</div>
      {!session.length && <><p className="muted">Luyện 20 lượt theo nhóm đang chọn, gồm biến đổi câu và ghép câu. Khi nhóm có ít chủ điểm, một số cấu trúc sẽ được ôn lại ở cùng lượt.</p><button className="primary" onClick={startSession}>Bắt đầu 20 lượt</button></>}
      {session[position] && <StructureDrill key={session[position].id + ':' + position} item={session[position]} done={correct => {
        setScore(value => value + Number(correct))
        setPosition(value => value + 1)
      }} />}
      {session.length > 0 && position === session.length && <div role="status" className="stack"><p>Kết quả: <strong>{score}/20</strong>. Các câu sai đã được lưu vào sổ lỗi.</p><button className="primary" onClick={startSession}>Luyện lại 20 lượt</button></div>}
    </section>
  </>
}
