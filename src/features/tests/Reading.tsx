import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Draft } from '../../types/study'

type Highlight = Draft['highlights'][number]

function segments(text: string, highlights: Highlight[]) {
  const boundaries = [...new Set([0, text.length, ...highlights.flatMap(item => [item.start, item.end])])].sort((a, b) => a - b)
  return boundaries.slice(0, -1).map((start, index) => {
    const end = boundaries[index + 1]
    const color = highlights.slice().reverse().find(item => item.start <= start && item.end >= end)?.color
    const phrase = text.slice(start, end)
    return color ? <mark key={start} data-color={color}>{phrase}</mark> : <span key={start}>{phrase}</span>
  })
}

export function Reading({ toolbar, paragraphs, highlights, patch, children }: {
  toolbar: ReactNode; paragraphs: string[]; highlights: Highlight[]; patch: (highlights: Highlight[]) => void; children: ReactNode
}) {
  const [tab, setTab] = useState<'passage' | 'questions'>('passage')
  const [color, setColor] = useState<Highlight['color']>('amber')
  const [selection, setSelection] = useState<Omit<Highlight, 'color'> | null>(null)
  const [selectedText, setSelectedText] = useState('')
  const [lookupResult, setLookupResult] = useState<{ word: string; phonetic?: string; meaning?: string; loading?: boolean } | null>(null)
  const passage = useRef<HTMLElement>(null)
  const panels = useRef<HTMLDivElement>(null)
  const tools = useRef<HTMLDivElement>(null)
  const scrollOffsets = useRef({ passage: 0, questions: 0 })
  const lookup = useRef<AbortController>(null)

  function switchTab(next: typeof tab) {
    if (next === tab) return
    const parent = panels.current?.parentElement
    const gap = parent ? Number.parseFloat(getComputedStyle(parent).rowGap) || 0 : 0
    const top = (panels.current?.getBoundingClientRect().top ?? 0) + window.scrollY
      - (tools.current?.offsetHeight ?? 0) - gap
    const scrolled = window.scrollY >= top - 1
    scrollOffsets.current[tab] = Math.max(0, window.scrollY - top)
    setSelection(null)
    setSelectedText('')
    window.getSelection()?.removeAllRanges()
    setTab(next)
    if (scrolled || scrollOffsets.current[next] > 0) {
      requestAnimationFrame(() => window.scrollTo(0, Math.max(0, top + scrollOffsets.current[next])))
    }
  }

  useEffect(() => {
    function selectionChanged() {
      const current = window.getSelection()
      if (!current?.rangeCount || current.isCollapsed) {
        return
      }
      const range = current.getRangeAt(0)
      const paragraph = Array.from(passage.current?.querySelectorAll<HTMLParagraphElement>('p[data-paragraph]') ?? [])
        .find(element => element.contains(range.startContainer) && element.contains(range.endContainer))
      if (!paragraph || !range.toString().trim()) {
        setSelection(null)
        setSelectedText('')
        return
      }
      const text = range.toString().trim()
      setSelectedText(text)
      const prefix = range.cloneRange()
      prefix.selectNodeContents(paragraph)
      prefix.setEnd(range.startContainer, range.startOffset)
      const start = prefix.toString().length
      setSelection({ paragraph: Number(paragraph.dataset.paragraph), start, end: start + range.toString().length })
    }
    document.addEventListener('selectionchange', selectionChanged)
    return () => document.removeEventListener('selectionchange', selectionChanged)
  }, [])
  useEffect(() => () => lookup.current?.abort(), [])

  async function handleLookup() {
    const cleanWord = selectedText.match(/^[^a-z]*([a-z]+(?:['-][a-z]+)*)[^a-z]*$/i)?.[1].toLowerCase()
    if (!cleanWord) return
    lookup.current?.abort()
    const controller = new AbortController()
    lookup.current = controller

    setLookupResult({ word: cleanWord, loading: true })
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, { signal: controller.signal })
      if (!res.ok) {
        setLookupResult({
          word: cleanWord,
          meaning: 'Từ vựng chuyên ngành hoặc từ ghép. Bạn có thể mở bản dịch Google bên dưới.'
        })
        return
      }
      const data = await res.json()
      if (controller.signal.aborted) return
      const first = data[0]
      const partOfSpeech = first?.meanings?.[0]?.partOfSpeech ?? ''
      const def = first?.meanings?.[0]?.definitions?.[0]?.definition ?? 'Không tìm thấy định nghĩa.'
      const phonetic = first?.phonetic ?? first?.phonetics?.find((p: { text?: string }) => p.text)?.text
      setLookupResult({
        word: cleanWord,
        phonetic,
        meaning: `[${partOfSpeech}] ${def}`
      })
    } catch {
      if (controller.signal.aborted) return
      setLookupResult({
        word: cleanWord,
        meaning: 'Không thể kết nối từ điển trực tuyến. Bấm xem dịch bên dưới.'
      })
    }
  }

  return <>
    <div ref={tools} className="exam-toolbar">
      {toolbar}
      <div className="row mobile-tabs">
        <button aria-pressed={tab === 'passage'} onClick={() => switchTab('passage')}>Bài đọc</button>
        <button aria-pressed={tab === 'questions'} onClick={() => switchTab('questions')}>Câu hỏi</button>
      </div>
    </div>

    <div ref={panels} className="split reading" data-tab={tab}>
      <section ref={passage} className="panel stack passage">
        <div className="between">
          <h2>Bài đọc</h2>
          <small className="muted">Bôi đen từ hoặc câu để highlight hoặc tra nghĩa</small>
        </div>

        <div className="row" style={{ flexWrap: 'wrap', gap: '0.45rem' }}>
          <select aria-label="Màu đánh dấu" value={color} onChange={event => setColor(event.target.value as Highlight['color'])}>
            <option value="amber">Vàng</option>
            <option value="green">Xanh</option>
            <option value="pink">Hồng</option>
          </select>

          <button
            className="button"
            disabled={!selection}
            onClick={() => {
              if (!selection) return
              patch([...highlights, { ...selection, color }])
              setSelection(null)
              setSelectedText('')
              window.getSelection()?.removeAllRanges()
            }}
          >
            Đánh dấu
          </button>

          <button
            className="button"
            disabled={!/^[^a-z]*[a-z]+(?:['-][a-z]+)*[^a-z]*$/i.test(selectedText)}
            onClick={handleLookup}
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            🔍 Tra từ "{selectedText.slice(0, 15)}{selectedText.length > 15 ? '...' : ''}"
          </button>

          <button className="button" disabled={!highlights.length} onClick={() => patch([])}>
            Xóa đánh dấu
          </button>
        </div>

        {lookupResult && (
          <div
            className="panel"
            style={{
              background: 'var(--inset)',
              borderColor: 'var(--accent)',
              borderWidth: '1.5px',
              padding: '0.85rem 1rem'
            }}
          >
            <div className="between" style={{ marginBottom: '0.3rem' }}>
              <strong>
                📖 {lookupResult.word} {lookupResult.phonetic && <span className="formula" style={{ marginLeft: '0.4rem' }}>/{lookupResult.phonetic}/</span>}
              </strong>
              <button
                type="button"
                className="button icon-only"
                aria-label="Đóng phần tra từ"
                onClick={() => { lookup.current?.abort(); setLookupResult(null) }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', lineHeight: 1.45 }}>
              {lookupResult.loading ? 'Đang tra từ điển...' : lookupResult.meaning}
            </p>
            <div className="row" style={{ gap: '0.6rem' }}>
              <a
                className="text-link"
                href={`https://translate.google.com/?sl=en&tl=vi&text=${encodeURIComponent(lookupResult.word)}&op=translate`}
                target="_blank"
                rel="noreferrer"
              >
                ↗ Mở Google Dịch tiếng Việt
              </a>
              <a
                className="text-link"
                href={`https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(lookupResult.word)}`}
                target="_blank"
                rel="noreferrer"
              >
                ↗ Cambridge Dictionary
              </a>
            </div>
          </div>
        )}

        {paragraphs.map((paragraph, index) => (
          <p key={index} data-paragraph={index}>
            {segments(paragraph, highlights.filter(item => item.paragraph === index && item.start < item.end && item.end <= paragraph.length))}
          </p>
        ))}
      </section>

      <div className="questions">{children}</div>
    </div>
  </>
}
