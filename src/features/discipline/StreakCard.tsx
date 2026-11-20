const milestones = [1, 10, 30, 60, 100, 365]

export function StreakCard({ days, longest, studied, protectedYesterday }: {
  days: number; longest: number; studied: boolean; protectedYesterday: boolean
}) {
  const stage = milestones.reduce((level, milestone, index) => days >= milestone ? index + 1 : level, 0)
  const next = milestones[stage]
  return <section className="panel streak-card stack" data-stage={stage} data-lit={studied}>
    <div className="row streak-title">
      <span className="flame" key={stage + (studied ? '-lit' : '-idle')}>
        <svg viewBox="0 0 32 36" aria-hidden="true">
          <path fill="currentColor" d="M17 1c1 8-5 12-6 16-2-1-3-3-3-6-5 4-7 9-6 14 1 6 7 10 14 10 8 0 14-5 14-13 0-7-6-12-9-14 1 6-1 8-2 8 1-5-1-11-2-15Z" />
          <path className="flame-core" d="M17 18c0 4-5 7-5 10 0 3 2 5 5 5s5-2 5-5c0-4-3-7-5-10Z" />
        </svg>
      </span>
      <div><span className="metric-label">Chuỗi học</span><strong className="metric-value">{days} ngày</strong></div>
    </div>
    <p className="muted">{studied ? 'Đã ghi nhận ngày học' : protectedYesterday ? 'Khiên đã giữ chuỗi hôm qua. Học hôm nay để tiếp tục.' : 'Làm ít nhất nửa phiên luyện hoặc hoàn thành một nhiệm vụ hôm nay.'}</p>
    <div className="between"><small>Kỷ lục {longest} ngày</small><small>{next ? 'Đổi màu ở ' + next + ' ngày' : 'Đã đạt mốc 365 ngày'}</small></div>
    {next && <progress aria-label={'Tiến độ đến mốc ' + next + ' ngày'} value={days} max={next} />}
    <details><summary>Các mốc đổi màu</summary><div className="row">{milestones.map((milestone, index) =>
      <span className="milestone" key={milestone} data-stage={index + 1}>{milestone} ngày{days >= milestone ? ' ✓' : ''}</span>
    )}</div></details>
  </section>
}
