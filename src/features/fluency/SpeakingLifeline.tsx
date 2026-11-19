import { useEffect, useState } from 'react'

interface SpeakingLifelineProps {
  topic?: string
  roundMinutes?: number
  defaultOpen?: boolean
}

interface OutlineStep {
  badge: string
  title: string
  timeHint: string
  prompt: string
  starter: string
}

const LINKING_GROUPS = [
  {
    label: 'Mở ý trực tiếp',
    phrases: [
      'Honestly, the first thing that comes to mind is...',
      'If I had to pick one, I would definitely say...',
      'To be honest, I really enjoy... because...',
    ],
  },
  {
    label: 'Mở rộng & Ví dụ',
    phrases: [
      'For instance, last time I...',
      'What makes it special is that...',
      'Not only that, it also helps me...',
    ],
  },
  {
    label: 'Cứu cánh khi bí ý (đừng im lặng)',
    phrases: [
      'Well, let me think about that for a second...',
      'How should I put this... basically,',
      'Actually, another point worth mentioning is...',
    ],
  },
]

const IDEA_TRIGGERS = [
  { key: 'Who', vi: 'Cùng ai?' },
  { key: 'When', vi: 'Từ khi nào / Tần suất?' },
  { key: 'Where', vi: 'Ở đâu?' },
  { key: 'Why', vi: 'Tại sao thích / quan trọng?' },
  { key: 'Before vs Now', vi: 'Trước đây có khác không?' },
]

function buildOutline(roundMinutes: number): OutlineStep[] {
  const totalSec = Math.max(60, Math.round(roundMinutes * 60))
  const s1 = Math.round(totalSec * 0.2)
  const s2 = Math.round(totalSec * 0.55)
  const s3 = totalSec - s1 - s2

  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    if (m === 0) return `~${s} giây`
    if (s === 0) return `~${m} phút`
    return `~${m}p${s < 10 ? '0' : ''}${s}s`
  }

  return [
    {
      badge: 'Bước 1 · Trực tiếp',
      title: 'Trả lời thẳng câu hỏi',
      timeHint: fmt(s1),
      prompt: 'Nêu ngay đối tượng/lựa chọn chính và 1 lý do lớn nhất.',
      starter: '“Well, I’d like to talk about... Simply because...”',
    },
    {
      badge: 'Bước 2 · Mở rộng',
      title: 'Kể 1 kỷ niệm hoặc chi tiết cụ thể',
      timeHint: fmt(s2),
      prompt: 'Chẻ nhỏ bằng 5W1H: kể lại một lần gần nhất, miêu tả bối cảnh và điều xảy ra.',
      starter: '“I still remember clearly when... At that moment...”',
    },
    {
      badge: 'Bước 3 · Cảm nghĩ',
      title: 'Tác động & Mong muốn tương lai',
      timeHint: fmt(s3),
      prompt: 'Chốt lại nó khiến bạn thấy thế nào và có muốn tiếp tục trong tương lai không.',
      starter: '“Overall, it makes me feel... In the future, I hope to...”',
    },
  ]
}

export function SpeakingLifeline({
  topic,
  roundMinutes = 4,
  defaultOpen = true,
}: SpeakingLifelineProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [used, setUsed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setUsed({})
  }, [topic, roundMinutes])

  const outline = buildOutline(roundMinutes)
  const usedCount = Object.values(used).filter(Boolean).length

  const togglePhrase = (phrase: string) => {
    setUsed(prev => ({ ...prev, [phrase]: !prev[phrase] }))
  }

  return (
    <section className="panel lifeline-panel">
      <button
        type="button"
        className="lifeline-toggle"
        aria-expanded={open}
        onClick={() => setOpen(prev => !prev)}
      >
        <div className="lifeline-toggle-text">
          <span className="pill">Phao cứu trợ</span>
          <h2>Gợi ý trả lời & Từ vựng cứu cánh</h2>
        </div>
        <div className="lifeline-toggle-meta">
          {usedCount > 0 && <span className="lifeline-used-badge">Đã dùng {usedCount} cụm</span>}
          <span className="lifeline-chevron" data-open={open} aria-hidden="true">
            {open ? 'Thu gọn' : 'Mở gợi ý'}
          </span>
        </div>
      </button>

      {open && (
        <div className="lifeline-body">
          {topic && (
            <p className="lifeline-topic">
              <span>Chủ đề hiện tại:</span> <strong>{topic}</strong>
            </p>
          )}

          <div className="lifeline-steps">
            {outline.map(step => (
              <article key={step.badge} className="lifeline-step">
                <div className="lifeline-step-top">
                  <span className="lifeline-step-badge">{step.badge}</span>
                  <span className="lifeline-step-time">{step.timeHint}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.prompt}</p>
                <p className="lifeline-starter">{step.starter}</p>
              </article>
            ))}
          </div>

          <div className="lifeline-triggers">
            <span className="lifeline-section-label">Bí ý? Chạm nhanh 5W1H:</span>
            <div className="lifeline-trigger-row">
              {IDEA_TRIGGERS.map(item => (
                <span key={item.key} className="lifeline-trigger-chip">
                  <strong>{item.key}</strong> {item.vi}
                </span>
              ))}
            </div>
          </div>

          <div className="lifeline-phrases">
            <span className="lifeline-section-label">
              Linking phrases cứu cánh (bấm để đánh dấu đã nói):
            </span>
            <div className="lifeline-phrase-groups">
              {LINKING_GROUPS.map(group => (
                <div key={group.label} className="lifeline-group">
                  <span className="lifeline-group-title">{group.label}</span>
                  <div className="lifeline-chip-list">
                    {group.phrases.map(phrase => (
                      <button
                        key={phrase}
                        type="button"
                        className="lifeline-phrase-chip"
                        data-used={Boolean(used[phrase])}
                        onClick={() => togglePhrase(phrase)}
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
