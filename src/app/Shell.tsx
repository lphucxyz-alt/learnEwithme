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
import { NavIcon, type NavIconKey } from '../components/NavIcons'
import { CelebrationHost } from '../features/discipline/CelebrationHost'

const routes: { path: string; iconKey: NavIconKey; title: string }[] = [
  { path: '/', iconKey: 'dashboard', title: 'Trung tâm' },
  { path: '/foundations', iconKey: 'foundations', title: 'Nền tảng' },
  { path: '/practice', iconKey: 'practice', title: 'Luyện nhanh' },
  { path: '/ipa', iconKey: 'ipa', title: 'Phòng lab IPA' },
  { path: '/shadowing', iconKey: 'fluency', title: 'Shadowing' },
  { path: '/verbs', iconKey: 'verbs', title: 'Động từ' },
  { path: '/structures', iconKey: 'structures', title: 'Kho cấu trúc' },
  { path: '/tests', iconKey: 'tests', title: 'Kho đề IELTS' }
]

const paths: Record<string, string> = {
  settings: 'M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-7 2v4',
  search: 'M16 16l5 5M10 3a7 7 0 100 14 7 7 0 000-14z',
  panel: 'M3 4h18v16H3zM9 4v16',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18'
}

function Icon({ name }: { name: string }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const menuToggle = useRef<HTMLButtonElement>(null)
  const menuClose = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const results = searchItems.filter(item => normalize(item.title + ' ' + item.type).includes(normalize(query))).slice(0, 12)

  function openSearch() {
    setQuery('')
    setCursor(0)
    if (!dialog.current?.open) dialog.current?.showModal()
  }

  function closeMenu() {
    setMobileMenuOpen(false)
    requestAnimationFrame(() => menuToggle.current?.focus())
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
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const viewport = window.matchMedia('(max-width: 768px)')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusFrame = requestAnimationFrame(() => menuClose.current?.focus())
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    const closeOnResize = () => { if (!viewport.matches) setMobileMenuOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    viewport.addEventListener('change', closeOnResize)
    return () => {
      cancelAnimationFrame(focusFrame)
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      viewport.removeEventListener('change', closeOnResize)
    }
  }, [mobileMenuOpen])

  return (
    <div className="shell" data-collapsed={collapsed} data-mobile-open={mobileMenuOpen}>
      <a href="#main-content" className="skip" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>
        Đến nội dung
      </a>

      <aside id="mobile-sidebar" className="sidebar" aria-label="Điều hướng chính">
        <div className="sidebar-heading">
          <Link className="brand" to="/" onClick={() => setMobileMenuOpen(false)}>
            <img src={import.meta.env.BASE_URL + 'icon.svg'} alt="" />
            <span>IELTS Discipline <strong>OS</strong></span>
          </Link>
          <button ref={menuClose} className="mobile-menu-close icon-only" type="button" aria-label="Đóng menu" onClick={closeMenu}><Icon name="close" /></button>
        </div>
        <nav aria-label="Điều hướng chính">
          {routes.map(route => (
            <NavLink key={route.path} end={route.path === '/'} to={route.path} title={route.title} aria-label={route.title} onClick={() => setMobileMenuOpen(false)}>
              <NavIcon name={route.iconKey} />
              <span className="nav-label">{route.title}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/settings" title="Cài đặt" onClick={() => setMobileMenuOpen(false)}>
            <Icon name="settings" />
            <span className="nav-label">Cài đặt</span>
          </NavLink>
        </div>
      </aside>

      <div className="workspace" inert={mobileMenuOpen}>
        <header className="topbar">
          <div className="topbar-navigation">
            <Link className="mobile-brand" to="/" aria-label="Trung tâm IELTS">
              <img src={import.meta.env.BASE_URL + 'icon.svg'} alt="" />
            </Link>
            <button className="sidebar-collapse icon-only" type="button"
              aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'} title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
              aria-controls="mobile-sidebar" aria-expanded={!collapsed} onClick={() => setCollapsed(value => !value)}>
              <Icon name="panel" />
            </button>
            <button ref={menuToggle} className="mobile-menu-toggle icon-only" type="button" aria-label="Mở menu điều hướng" aria-expanded={mobileMenuOpen} aria-controls="mobile-sidebar" onClick={() => setMobileMenuOpen(true)}>
              <Icon name="menu" />
            </button>
            <button className="search-button" aria-label="Tìm nội dung" onClick={openSearch}>
              <Icon name="search" />
              <span>Tìm nội dung</span>
              <kbd>Ctrl K</kbd>
            </button>
          </div>
          <div className="top-actions">
            <FocusTimer />
            <button
              className="icon-only theme-toggle"
              aria-label={state.theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
              onClick={() => update(current => ({ ...current, theme: current.theme === 'light' ? 'dark' : 'light' }))}
            >
              {state.theme === 'light' ? '☾' : '☀'}
            </button>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="main">
          {storageError && <p className="panel error" role="alert">Thiết bị không lưu được tiến độ. Hãy xuất bản sao lưu trong Cài đặt.</p>}
          <Outlet key={location.pathname === '/verbs' || location.pathname === '/tests' ? location.search : undefined} />
        </main>
      </div>

      {mobileMenuOpen && <button className="mobile-scrim" type="button" tabIndex={-1} aria-label="Đóng menu điều hướng" onClick={closeMenu} />}

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
      }}>
        <div className="between">
          <h2>Tìm nội dung</h2>
          <button onClick={() => dialog.current?.close()}>Đóng</button>
        </div>
        <input autoFocus type="search" aria-label="Tìm âm, từ, cấu trúc hoặc đề thi" value={query} onChange={event => { setQuery(event.target.value); setCursor(0) }} />
        {results.map((result, index) => (
          <Link key={result.path} className="quest" data-active={cursor === index} to={result.path} onClick={() => dialog.current?.close()}>
            <span>{result.title}</span>
            <small>{result.type}</small>
          </Link>
        ))}
        {!results.length && <p>Không tìm thấy kết quả.</p>}
      </dialog>

      <CelebrationHost />
    </div>
  )
}
