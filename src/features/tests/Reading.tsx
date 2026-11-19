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

export function Reading({ paragraphs, highlights, patch, children }: {
  paragraphs: string[]; highlights: Highlight[]; patch: (highlights: Highlight[]) => void; children: ReactNode
}) {
  const [tab, setTab] = useState('passage')
  const [color, setColor] = useState<Highlight['color']>('amber')
  const [selection, setSelection] = useState<Omit<Highlight, 'color'> | null>(null)
  const passage = useRef<HTMLElement>(null)
  useEffect(() => {
    function selectionChanged() {
      const current = window.getSelection()
      if (!current?.rangeCount || current.isCollapsed) return
      const range = current.getRangeAt(0)
      const paragraph = Array.from(passage.current?.querySelectorAll('p') ?? [])
        .find(element => element.contains(range.startContainer) && element.contains(range.endContainer))
      if (!paragraph) return
      const prefix = range.cloneRange()
      prefix.selectNodeContents(paragraph)
      prefix.setEnd(range.startContainer, range.startOffset)
      const start = prefix.toString().length
      setSelection({ paragraph: Number(paragraph.dataset.paragraph), start, end: start + range.toString().length })
    }
    document.addEventListener('selectionchange', selectionChanged)
    return () => document.removeEventListener('selectionchange', selectionChanged)
  }, [])
  return <>
    <div className="row mobile-tabs"><button aria-pressed={tab === 'passage'} onClick={() => setTab('passage')}>Bài đọc</button><button aria-pressed={tab === 'questions'} onClick={() => setTab('questions')}>Câu hỏi</button></div>
    <div className="split reading" data-tab={tab}>
      <section ref={passage} className="panel stack passage"><h2>Bài đọc</h2>
        <div className="row">
          <select aria-label="Màu đánh dấu" value={color} onChange={event => setColor(event.target.value as Highlight['color'])}>
            <option value="amber">Vàng</option><option value="green">Xanh</option><option value="pink">Hồng</option>
          </select>
          <button disabled={!selection} onClick={() => {
            if (!selection) return
            patch([...highlights, { ...selection, color }])
            setSelection(null)
            window.getSelection()?.removeAllRanges()
          }}>Đánh dấu</button><button disabled={!highlights.length} onClick={() => patch([])}>Xóa đánh dấu</button>
        </div>
        {paragraphs.map((paragraph, index) => <p key={index} data-paragraph={index}>{segments(paragraph, highlights.filter(item => item.paragraph === index && item.start < item.end && item.end <= paragraph.length))}</p>)}
      </section>
      <div className="questions">{children}</div>
    </div>
  </>
}
