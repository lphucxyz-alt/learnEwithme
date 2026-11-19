import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { lessons } from '../data/foundations/catalog'
import { sounds } from '../data/ipa'
import { structures } from '../data/structures'
import { FocusTimer } from '../features/discipline/FocusTimer'
import { exams } from '../features/tests/catalog'
import { verbs } from '../features/verbs/verbs'
import { stopAudio } from '../services/audio'
import { useStudy } from './StudyProvider'

const routes = [
  { path: '/', icon: 'home', title: 'Trung tâm', mobile: 'Hôm nay' },
  { path: '/foundations', icon: 'book', title: 'Nền tảng', mobile: 'Nền tảng' },
  { path: '/practice', icon: 'bolt', title: 'Luyện nhanh', mobile: 'Luyện' },
  { path: '/ipa', icon: 'audio', title: 'Phòng lab IPA', mobile: 'IPA' },
  { path: '/verbs', icon: 'cards', title: 'Động từ', mobile: 'Động từ' },
  { path: '/structures', icon: 'layers', title: 'Kho cấu trúc', mobile: 'Cấu trúc' },
  { path: '/tests', icon: 'exam', title: 'Kho đề IELTS', mobile: 'Kho đề' }
]
const paths: Record<string, string> = {
  home: 'M3 10L12 3l9 7v10H3zM9 20v-7h6v7',
  book: 'M12 5v15M12 5c-3-2-6-3-9-2v15c3-1 6 0 9 2 3-2 6-3 9-2V3c-3-1-6 0-9 2',
  bolt: 'M13 2L4 14h7l-1 8 10-12h-7z',
  audio: 'M4 10v4m4-8v12m4-15v18m4-15v12m4-8v4',
  cards: 'M7 4h13v15H7zM4 8v13h12',
  layers: 'M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5',
  exam: 'M5 3h11l3 3v15H5zM8 10h8m-8 4h8m-8 4h5',
  settings: 'M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-7 2v4',
  search: 'M16 16l5 5M10 3a7 7 0 100 14 7 7 0 000-14z',
  panel: 'M3 4h18v16H3zM9 4v16'
}

function Icon({ name }: { name: string }) {
  return <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
}

const searchItems = [
  ...routes.map(route => ({ title: route.title, type: 'Điều hướng', path: route.path })),
  ...lessons.map(item => ({ title: item.title, type: 'Nền tảng ' + item.level, path: '/foundations/' + item.id })),
  ...sounds.map(sound => ({ title: '/' + sound.symbol + '/ · ' + sound.word, type: 'IPA', path: '/ipa?sound=' + encodeURIComponent(sound.symbol) })),
  ...verbs.map(verb => ({ title: verb.base + ' · ' + verb.meaning, type: 'Động từ', path: '/verbs?q=' + encodeURIComponent(verb.base) })),
  ...structures.map(item => ({ title: item.title, type: item.category, path: '/structures?id=' + item.id })),
  ...exams.map(exam => ({ title: exam.title, type: exam.skill, path: '/tests/' + exam.id }))
]
function normalize(query: string) {
  return query.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replaceAll('đ','d').trim()
}

export function Shell() {
  const { state, update, storageError } = useStudy()
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const results = searchItems.filter(item => normalize(item.title + ' ' + item.type).includes(normalize(query))).slice(0, 12)
  function openSearch() {
    setQuery('')
    setCursor(0)
    if (!dialog.current?.open) dialog.current?.showModal()
  }
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const editing = (event.target as HTMLElement).closest('input, textarea, select, [contenteditable]')
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' || event.key === '/' && !editing) {
        event.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    stopAudio()
    window.scrollTo(0, 0)
  }, [location.pathname])
  return <div className="shell" data-collapsed={collapsed}>
    <a href="#main-content" className="skip" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>Đến nội dung</a>
    <aside className="sidebar">
      <Link className="brand" to="/"><img src={import.meta.env.BASE_URL + 'icon.svg'} alt="" /><span>IELTS Discipline <strong>OS</strong></span></Link>
      <nav aria-label="Điều hướng chính">{routes.map(route => <NavLink key={route.path} end={route.path === '/'} to={route.path} title={route.title}><Icon name={route.icon} /><span>{route.title}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><NavLink to="/settings" title="Cài đặt"><Icon name="settings" /><span>Cài đặt</span></NavLink>
      <button className="collapse" aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'} onClick={() => setCollapsed(value => !value)}><Icon name="panel" /><span>Thu gọn</span></button></div>
    </aside>
    <div className="workspace">
      <header className="topbar">
        <Link className="mobile-brand" to="/"><img src={import.meta.env.BASE_URL + 'icon.svg'} alt="" /><strong>IELTS OS</strong></Link>
        <button className="search-button" onClick={openSearch}><Icon name="search" /><span>Tìm nội dung</span><kbd>Ctrl K</kbd></button>
        <div className="top-actions"><FocusTimer /><Link className="button icon-only mobile-settings" to="/settings" aria-label="Cài đặt"><Icon name="settings" /></Link>
          <button className="icon-only theme-toggle" aria-label={state.theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'} onClick={() => update(current => ({ ...current, theme: current.theme === 'light' ? 'dark' : 'light' }))}>{state.theme === 'light' ? '☾' : '☀'}</button>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="main">{storageError && <p className="panel error" role="alert">Thiết bị không lưu được tiến độ. Hãy xuất bản sao lưu trong Cài đặt.</p>}<Outlet key={location.pathname === '/verbs' ? location.search : undefined} /></main>
    </div>
    <nav className="bottom-nav" aria-label="Điều hướng di động">{routes.map(route => <NavLink key={route.path} end={route.path === '/'} to={route.path}><Icon name={route.icon} /><span>{route.mobile}</span></NavLink>)}</nav>
    <dialog ref={dialog} aria-label="Tìm nội dung" className="palette" onKeyDown={event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        setCursor(value => Math.max(0, Math.min(results.length - 1, value + (event.key === 'ArrowDown' ? 1 : -1))))
      }
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement && results[cursor]) {
        event.preventDefault()
        navigate(results[cursor].path)
        dialog.current?.close()
      }
    }}><div className="between"><h2>Tìm nội dung</h2><button onClick={() => dialog.current?.close()}>Đóng</button></div>
      <input autoFocus type="search" aria-label="Tìm âm, từ, cấu trúc hoặc đề thi" value={query} onChange={event => { setQuery(event.target.value); setCursor(0) }} />
      {results.map((result, index) => <Link key={result.path} className="quest" data-active={cursor === index} to={result.path} onClick={() => dialog.current?.close()}><span>{result.title}</span><small>{result.type}</small></Link>)}
      {!results.length && <p>Không tìm thấy kết quả.</p>}
    </dialog>
  </div>
}
