import { useStudy } from '../../app/StudyProvider'
import { Listen } from '../../components/Audio'
import { Link } from 'react-router-dom'
import { rememberPractice } from '../../services/random'
import type { Domain } from '../../types/study'

interface RoutineTask {
  id: string
  title: string
  detail: string
  minutes: number
  href: string
  action: string
  domain: Domain
}

const weeklySchedule: Record<number, RoutineTask[]> = {
  1: [
    { id: 'speak-432', title: 'Luyện nói 4/3/2 với một đề', detail: 'Nói 4 phút, nghe lại và sửa một lỗi, rồi nói lại trong 3 phút và 2 phút.', minutes: 20, href: '/practice/speaking', action: 'Mở phòng luyện nói', domain: 'practice' },
    { id: 'easy-listen', title: 'Nghe nội dung tiếng Anh vừa sức', detail: 'Chọn một bài nghe ngắn, nghe để hiểu ý chính và ghi lại vài cụm hữu ích.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe', domain: 'tests' },
  ],
  2: [
    { id: 'read-easy', title: 'Đọc một bài vừa sức', detail: 'Đọc gần hết nội dung mà không phải tra liên tục. Đoán nghĩa từ mới qua câu.', minutes: 20, href: '/tests?skill=Reading', action: 'Chọn bài đọc', domain: 'tests' },
    { id: 'new-words', title: 'Đặt câu với từ mới', detail: 'Chọn một từ vừa gặp, viết hai câu về cuộc sống của bạn và đọc thành tiếng.', minutes: 10, href: '/foundations', action: 'Mở bài học', domain: 'foundations' },
  ],
  3: [
    { id: 'speak-432', title: 'Luyện nói 4/3/2 với một đề', detail: 'Nói 4 phút, nghe lại và sửa một lỗi, rồi nói lại trong 3 phút và 2 phút.', minutes: 20, href: '/practice/speaking', action: 'Mở phòng luyện nói', domain: 'practice' },
    { id: 'easy-listen', title: 'Nghe nội dung tiếng Anh vừa sức', detail: 'Chọn một bài nghe ngắn, nghe để hiểu ý chính và ghi lại vài cụm hữu ích.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe', domain: 'tests' },
  ],
  4: [
    { id: 'read-easy', title: 'Đọc một bài vừa sức', detail: 'Đọc gần hết nội dung mà không phải tra liên tục. Đoán nghĩa từ mới qua câu.', minutes: 20, href: '/tests?skill=Reading', action: 'Chọn bài đọc', domain: 'tests' },
    { id: 'new-words', title: 'Đặt câu với từ mới', detail: 'Chọn một từ vừa gặp, viết hai câu về cuộc sống của bạn và đọc thành tiếng.', minutes: 10, href: '/foundations', action: 'Mở bài học', domain: 'foundations' },
  ],
  5: [
    { id: 'speak-432', title: 'Luyện nói 4/3/2 với một đề', detail: 'Nói 4 phút, nghe lại và sửa một lỗi, rồi nói lại trong 3 phút và 2 phút.', minutes: 20, href: '/practice/speaking', action: 'Mở phòng luyện nói', domain: 'practice' },
    { id: 'easy-listen', title: 'Nghe nội dung tiếng Anh vừa sức', detail: 'Chọn một bài nghe ngắn, nghe để hiểu ý chính và ghi lại vài cụm hữu ích.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe', domain: 'tests' },
  ],
  6: [
    { id: 'weekly-story', title: 'Ghi âm kể lại tuần này bằng tiếng Anh', detail: 'Nói khoảng 3 phút về việc bạn đã làm, điều thú vị và kế hoạch tuần sau.', minutes: 3, href: '/practice/speaking', action: 'Mở phòng ghi âm', domain: 'practice' },
    { id: 'easy-listen', title: 'Đọc hoặc nghe nội dung vừa sức', detail: 'Chọn bài ngắn và tận hưởng việc hiểu được nhiều hơn mà không dừng ở mọi từ mới.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe', domain: 'tests' },
  ],
  0: [
    { id: 'weekly-story', title: 'Ghi âm kể lại tuần này bằng tiếng Anh', detail: 'Nói khoảng 3 phút về việc bạn đã làm, điều thú vị và kế hoạch tuần sau.', minutes: 3, href: '/practice/speaking', action: 'Mở phòng ghi âm', domain: 'practice' },
    { id: 'easy-listen', title: 'Đọc hoặc nghe nội dung vừa sức', detail: 'Chọn bài ngắn và tận hưởng việc hiểu được nhiều hơn mà không dừng ở mọi từ mới.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe', domain: 'tests' },
  ],
}

const dayNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const practiceSteps = [
  ['Học từ trong ngữ cảnh', 'Tra nghĩa nếu cần, viết hai câu về cuộc sống của bạn, rồi đọc to.'],
  ['Đọc hoặc nghe vừa sức', 'Dành 15–20 phút cho nội dung bạn hiểu gần hết. Gặp lại từ đã biết để nhận diện nhanh hơn.'],
  ['Luyện nói 4/3/2', 'Ba buổi mỗi tuần, nói cùng một đề trong 4 phút, nghe lại và sửa, rồi nói lại trong 3 phút và 2 phút.'],
  ['Tự nói mỗi ngày', 'Mô tả việc đang làm vài phút. Ghi lại cụm khiến bạn bị khựng để tra sau.'],
  ['Đo tiến độ mỗi tháng', 'Ghi âm lại cùng một đề Speaking và so với bản trước.'],
]

const dailyTask: RoutineTask = {
  id: 'self-talk', title: 'Tự nói thầm bằng tiếng Anh',
  detail: 'Mô tả việc bạn đang làm và ghi lại một cụm từ khiến bạn bị khựng.',
  minutes: 5, href: '/practice/speaking', action: 'Mở bài luyện nói', domain: 'practice',
}

export function FluencyPlan({ weekday, dateKey }: { weekday: number; dateKey: string }) {
  const { state, complete, update } = useStudy()
  const tasks = [...weeklySchedule[weekday], dailyTask]
  const date = new Date(dateKey + 'T12:00:00')
  const dateLabel = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long' }).format(date)
  const doneCount = tasks.filter(task => state.recentPractice.includes(dateKey + ':routine:' + task.id)).length
  const totalMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0)

  function startTask(task: RoutineTask) {
    const prefix = dateKey + ':routine-start:' + task.id + ':'
    update(previous => ({ ...previous, recentPractice: rememberPractice(
      previous.recentPractice.filter(key => !key.startsWith(prefix)), [prefix + Date.now()]
    ) }))
  }

  function markDone(task: RoutineTask) {
    const doneKey = dateKey + ':routine:' + task.id
    if (state.recentPractice.includes(doneKey)) return
    const prefix = dateKey + ':routine-start:' + task.id + ':'
    const startKey = state.recentPractice.filter(key => key.startsWith(prefix)).at(-1)
    const startedAt = startKey ? Number(startKey.slice(prefix.length)) : 0
    const seconds = startedAt ? Math.min(task.minutes * 60, Math.max(0, Math.floor((Date.now() - startedAt) / 1000))) : 0
    complete(task.domain, 5, seconds)
    update(previous => ({ ...previous, recentPractice: rememberPractice(
      previous.recentPractice.filter(key => !key.startsWith(prefix)), [doneKey]
    ) }))
  }

  return <section className="panel daily-routine" aria-labelledby="daily-routine-title">
    <div className="daily-routine-heading">
      <div><p className="overline">KẾ HOẠCH HÔM NAY · {dateLabel.toLocaleUpperCase('vi-VN')}</p>
        <h2 id="daily-routine-title">{dayNames[weekday]}: học gì hôm nay?</h2>
        <p className="muted">Làm lần lượt các việc ngắn này. Mở bài học, rồi đánh dấu xong khi bạn đã thực hành.</p>
      </div>
      <div className="daily-routine-total"><strong>{doneCount}/{tasks.length}</strong><span>nhiệm vụ · khoảng {totalMinutes} phút</span></div>
    </div>
    <progress value={doneCount} max={tasks.length} aria-label="Nhiệm vụ trong lịch hôm nay đã hoàn thành" />
    <div className="daily-routine-list">
      {tasks.map((task, index) => {
        const done = state.recentPractice.includes(dateKey + ':routine:' + task.id)
        return <article className="daily-routine-task" key={task.id} data-done={done}>
          <span className="daily-routine-index">{done ? '✓' : String(index + 1).padStart(2, '0')}</span>
          <div className="daily-routine-copy"><div className="row"><h3>{task.title}</h3><span className="pill">{task.minutes} phút</span></div><p>{task.detail}</p></div>
          <div className="daily-routine-actions">
            <Link className="button daily-routine-open" to={task.href} onClick={() => startTask(task)}>{task.action} ↗</Link>
            <button type="button" disabled={done} aria-label={done ? task.title + ' · đã hoàn thành' : 'Đánh dấu hoàn thành · ' + task.title} onClick={() => markDone(task)}>{done ? 'Đã xong' : 'Hoàn thành'}</button>
          </div>
        </article>
      })}
    </div>
    <details className="daily-routine-details">
      <summary>Xem lộ trình luyện phản xạ trong tuần</summary>
      <div className="daily-weekly-schedule">
        <div><strong>Thứ 2, 4, 6</strong><p>20 phút nói 4/3/2 với một đề · 15 phút nghe vừa sức</p></div>
        <div><strong>Thứ 3, 5</strong><p>20 phút đọc bài vừa sức · 10 phút đặt câu với từ mới</p></div>
        <div><strong>Thứ 7, Chủ nhật</strong><p>Ghi âm 3 phút kể lại tuần · 15 phút đọc hoặc nghe</p></div>
        <div><strong>Mỗi ngày</strong><p>5 phút tự nói thầm và ghi cụm từ bị kẹt</p></div>
      </div>
    </details>
    <details className="daily-routine-details">
      <summary>5 bước thực hành để nhớ lâu và nói tự nhiên</summary>
      <ol className="daily-practice-steps">{practiceSteps.map(([title, description]) => <li key={title}><strong>{title}</strong><p>{description}</p></li>)}</ol>
      <p className="muted">Bạn có thể dịch ở lần gặp đầu. Khi gặp lại đủ nhiều, hãy tập gọi cả cụm tiếng Anh theo ý mình muốn nói.</p>
      <div className="row">{["I'd definitely say…", 'The main reason is that…', "It's much more convenient."].map(chunk => <Listen key={chunk} text={chunk} label={chunk} />)}</div>
    </details>
  </section>
}
