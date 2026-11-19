import { Link } from 'react-router-dom'

interface EmptyStateCardProps {
  badge?: string
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
}

export function OnboardingWelcomeCard() {
  return (
    <section className="panel onboarding-card">
      <div className="onboarding-badge-row">
        <span className="pill">Khởi động hành trình</span>
        <span className="onboarding-step-note">Mất khoảng 3 phút</span>
      </div>

      <div className="onboarding-content">
        <h2>Tuyệt vời! Bạn đang ở vạch xuất phát.</h2>
        <p>
          Hãy làm ngay bài chẩn đoán nhanh để hệ thống gợi ý lộ trình phù hợp nhất cho bạn!
        </p>
      </div>

      <div className="onboarding-actions">
        <Link className="button primary" to="/tests">
          Làm bài chẩn đoán nhanh
        </Link>
        <Link className="button" to="/foundations">
          Hoặc học 3 câu nền tảng trước
        </Link>
      </div>
    </section>
  )
}

export function EmptyStateCard({
  badge = 'Sẵn sàng ghi nhận',
  title,
  description,
  actionLabel,
  actionTo,
}: EmptyStateCardProps) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8L12 14.6 7 18.2l1.9-5.8L4 8.8h6.1z" />
        </svg>
      </div>
      <span className="empty-state-badge">{badge}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && actionTo && (
        <Link className="button" to={actionTo}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
