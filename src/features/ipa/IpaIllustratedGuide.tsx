import { useState } from 'react'
import { ipaGuidePages } from '../../data/ipa-guide'

interface IpaIllustratedGuideProps {
  onSelectSound: (symbol: string) => void
}

export function IpaIllustratedGuide({ onSelectSound }: IpaIllustratedGuideProps) {
  const [activePage, setActivePage] = useState(0)
  const page = ipaGuidePages[activePage]

  return (
    <details className="panel ipa-guide" id="ipa-reference">
      <summary><strong>Tài liệu khẩu hình minh họa</strong> <small>· {ipaGuidePages.length} bài</small></summary>
      <div className="stack">

      <div className="ipa-guide-tabs" role="tablist" aria-label="Bài học IPA bằng hình">
        {ipaGuidePages.map((item, index) => (
          <button
            key={item.image}
            className="ipa-guide-tab"
            type="button"
            role="tab"
            aria-selected={activePage === index}
            aria-controls="ipa-guide-content"
            onClick={() => setActivePage(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.title}
          </button>
        ))}
      </div>

      <div className="ipa-guide-content" id="ipa-guide-content" role="tabpanel">
        <div className="ipa-guide-copy">
          <p className="overline">{page.eyebrow}</p>
          <h3>{page.title}</h3>
          <p>{page.summary}</p>
          <div className="ipa-guide-sounds" aria-label="Chọn âm để luyện">
            {page.sounds.map(symbol => (
              <button className="ipa-guide-sound" type="button" key={symbol} onClick={() => onSelectSound(symbol)}>
                /{symbol}/ <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <small className="muted">Chọn một âm để mở sơ đồ cấu âm, hướng dẫn cho người Việt và nút ghi âm so sánh.</small>
        </div>
        <figure className="ipa-guide-figure">
          <img
            src={import.meta.env.BASE_URL + 'ipa-guide/' + page.image}
            alt={page.title + ' — tài liệu hình minh họa phát âm tiếng Anh'}
            loading="lazy"
            decoding="async"
          />
          <figcaption>Tài liệu hình do bạn cung cấp · {page.title}</figcaption>
        </figure>
      </div>
      </div>
    </details>
  )
}
