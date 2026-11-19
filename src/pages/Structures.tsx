import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { Listen } from '../components/Audio'
import { structureCard, structures } from '../data/structures'
import { StructureDrill } from '../features/structures/StructureDrill'

export default function Structures() {
  const [params, setParams] = useSearchParams()
  const [category, setCategory] = useState('')
  const { state, complete } = useStudy()
  const filtered = structures.filter(item => !category || item.category === category)
  const item = filtered.find(entry => entry.id === params.get('id')) ?? filtered[0]
  const saved = Boolean(state.cards['structure:' + item.id])
  return <>
    <header className="page-head"><p className="overline">WRITING & SPEAKING</p><h1>Kho cấu trúc IELTS</h1><p>So sánh cách diễn đạt và áp dụng ngay vào câu mới.</p></header>
    <div className="split">
      <section className="panel stack">
        <label>Nhóm bài<select value={category} onChange={event => setCategory(event.target.value)}><option value="">Tất cả</option>
          {[...new Set(structures.map(entry => entry.category))].map(value => <option key={value}>{value}</option>)}</select></label>
        <div className="tiles">{filtered.map(entry => <button key={entry.id} aria-pressed={item.id === entry.id} onClick={() => setParams({ id: entry.id })}>{entry.title}</button>)}</div>
      </section>
      <section className="panel stack"><div className="between"><h2>{item.title}</h2><span className="pill">{item.category}</span></div>
        <p className="formula">{item.formula}</p>
        <div className="comparison">
          <div><span className="overline">Ví dụ cơ bản · 5.5</span><p>{item.basic}</p><Listen text={item.basic} /></div>
          <div><span className="overline">Ví dụ nâng cấp · 7.5–8.5</span><p>{item.upgraded}</p><Listen text={item.upgraded} /></div>
        </div>
        <p>{item.reason}</p>
        <button disabled={saved} onClick={() => complete('structures', 1, 0, [structureCard(item)], false)}>{saved ? 'Đã lưu vào sổ lỗi' : 'Đánh dấu khó'}</button>
      </section>
    </div>
    <section className="panel stack"><h2>Áp dụng cấu trúc</h2><StructureDrill key={item.id} item={item} /></section>
  </>
}
