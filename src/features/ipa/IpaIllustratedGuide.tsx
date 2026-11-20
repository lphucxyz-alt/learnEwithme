import { useState } from 'react'
import { ipaGuidePages } from '../../data/ipa-guide'

interface IpaIllustratedGuideProps {
  onSelectSound: (symbol: string) => void
}

export function IpaIllustratedGuide({ onSelectSound }: IpaIllustratedGuideProps) {
  const [activePage, setActivePage] = useState(0)
  const page = ipaGuidePages[activePage]

  return (
    <section className="panel ipa-guide" aria-labelledby="ipa-guide-title">
      <div className="ipa-guide-heading">
        <div>
          <p className="overline">LỘ TRÌNH KHẨU HÌNH · 5 BÀI NGẮN</p>
          <h2 id="ipa-guide-title">Học bằng hình, luyện ngay từng âm</h2>
          <p className="muted">Bộ hình bạn gửi được chia thành từng bài. Chọn ký hiệu để xem khẩu hình động và nghe mẫu.</p>
        </div>
        <span className="pill">Bài {String(activePage + 1).padStart(2, '0')} / {ipaGuidePages.length}</span>
      </div>

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
            loading={activePage === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
          <figcaption>Tài liệu hình do bạn cung cấp · {page.title}</figcaption>
        </figure>
      </div>
    </section>
  )
}
