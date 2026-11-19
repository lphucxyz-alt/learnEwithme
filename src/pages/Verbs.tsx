import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Listen } from '../components/Audio'
import { Flashcard, VerbDrill } from '../features/verbs/VerbDrill'
import { verbExample, verbGroup, verbs } from '../features/verbs/verbs'

export default function Verbs() {
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [group, setGroup] = useState('')
  const [mode, setMode] = useState<'library' | 'flash' | 'typing' | 'cloze'>('library')
  const [position, setPosition] = useState(0)
  const [round, setRound] = useState(0)
  const filtered = verbs.filter(verb => (!group || group === verbGroup(verb) || group === 'ought' && /[oa]ught$/.test(verb.past) || group === 'iau' && /i/.test(verb.base) && /a/.test(verb.past) && /u/.test(verb.part))
    && [verb.base, verb.past, verb.part, verb.meaning].some(value => value.toLowerCase().includes(query.toLowerCase().trim())))
  const verb = filtered[position % (filtered.length || 1)]
  function move(direction: number) {
    setPosition(value => (value + direction + filtered.length) % filtered.length)
    setRound(value => value + 1)
  }
  return <>
    <header className="page-head"><p className="overline">TỪ VỰNG</p><h1>Động từ bất quy tắc</h1><p>Luyện {verbs.length} động từ theo quy luật biến đổi và ngữ cảnh.</p></header>
    <section className="panel stack">
      <div className="row">
        <input type="search" aria-label="Tìm động từ" placeholder="Tìm động từ hoặc nghĩa" value={query} onChange={event => { setQuery(event.target.value); setPosition(0) }} />
        <select aria-label="Nhóm biến đổi" value={group} onChange={event => { setGroup(event.target.value); setPosition(0) }}>
          <option value="">Tất cả nhóm</option>{['AAA','ABB','ABA','AAB','ABC'].map(value => <option key={value}>{value}</option>)}
          <option value="ought">-ought / -aught</option><option value="iau">i–a–u</option>
        </select>
      </div>
      <div className="row">{([['library', 'Tra cứu'], ['flash', 'Flashcard'], ['typing', 'Gõ nhanh'], ['cloze', 'Điền ngữ cảnh']] as const).map(([value, label]) =>
        <button key={value} aria-pressed={mode === value} onClick={() => { setMode(value); setPosition(0) }}>{label}</button>)}</div>
      {!verb && <p>Không tìm thấy động từ phù hợp.</p>}
      {verb && mode === 'flash' && <Flashcard key={verb.base + round} verb={verb} move={move} />}
      {verb && (mode === 'typing' || mode === 'cloze') && <VerbDrill key={mode + verb.base + round} verb={verb} mode={mode} done={() => move(1)} />}
      {mode === 'library' && <div className="catalog">{filtered.map(item => <article className="catalog-item" key={item.base} id={'verb-' + item.base}>
        <div className="between"><h2>{item.base}</h2><span className="pill">{verbGroup(item)} · {item.level}</span></div>
        <p>{item.meaning}</p>
        <div className="forms">{[item.base, item.past, item.part].map((form, index) => <div key={index}><strong>V{index + 1} · {form}</strong><small>/{item.ipa[index]}/</small><Listen text={item.base === 'read' && index > 0 ? 'red' : form.replaceAll('/', ', ')} /></div>)}</div>
        <p>{verbExample(item)} <Listen text={verbExample(item)} /></p>
      </article>)}</div>}
    </section>
  </>
}
