import { useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { Listen } from '../../components/Audio'
import { Link } from 'react-router-dom'
import { exams } from '../tests/catalog'
import { dayKey } from './activity'
import { countWords, hasExamCredit } from './study-credit'
import { saveRoutineNote, type RoutineNote } from './routine-work'

type RoutineId = RoutineNote | 'speak-432' | 'weekly-story' | 'easy-listen' | 'read-easy'

interface RoutineTask {
  id: RoutineId
  title: string
  detail: string
  minutes: number
  href?: string
  action?: string
}

const weeklySchedule: Record<number, RoutineTask[]> = {
  1: [
    { id: 'speak-432', title: 'Luyện nói 4/3/2 với một đề', detail: 'Nói 4 phút, nghe lại và sửa một lỗi, rồi nói lại trong 3 phút và 2 phút.', minutes: 20, href: '/practice/speaking', action: 'Mở phòng luyện nói' },
    { id: 'easy-listen', title: 'Nghe nội dung tiếng Anh vừa sức', detail: 'Chọn một bài nghe ngắn, nghe để hiểu ý chính và ghi lại vài cụm hữu ích.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe' },
  ],
  2: [
    { id: 'read-easy', title: 'Đọc một bài vừa sức', detail: 'Đọc gần hết nội dung mà không phải tra liên tục. Đoán nghĩa từ mới qua câu.', minutes: 20, href: '/tests?skill=Reading', action: 'Chọn bài đọc' },
    { id: 'new-words', title: 'Đặt câu với từ mới', detail: 'Chọn một từ vừa gặp, viết hai câu về cuộc sống của bạn và đọc thành tiếng.', minutes: 10 },
  ],
  3: [
    { id: 'speak-432', title: 'Luyện nói 4/3/2 với một đề', detail: 'Nói 4 phút, nghe lại và sửa một lỗi, rồi nói lại trong 3 phút và 2 phút.', minutes: 20, href: '/practice/speaking', action: 'Mở phòng luyện nói' },
    { id: 'easy-listen', title: 'Nghe nội dung tiếng Anh vừa sức', detail: 'Chọn một bài nghe ngắn, nghe để hiểu ý chính và ghi lại vài cụm hữu ích.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe' },
  ],
  4: [
    { id: 'read-easy', title: 'Đọc một bài vừa sức', detail: 'Đọc gần hết nội dung mà không phải tra liên tục. Đoán nghĩa từ mới qua câu.', minutes: 20, href: '/tests?skill=Reading', action: 'Chọn bài đọc' },
    { id: 'new-words', title: 'Đặt câu với từ mới', detail: 'Chọn một từ vừa gặp, viết hai câu về cuộc sống của bạn và đọc thành tiếng.', minutes: 10 },
  ],
  5: [
    { id: 'speak-432', title: 'Luyện nói 4/3/2 với một đề', detail: 'Nói 4 phút, nghe lại và sửa một lỗi, rồi nói lại trong 3 phút và 2 phút.', minutes: 20, href: '/practice/speaking', action: 'Mở phòng luyện nói' },
    { id: 'easy-listen', title: 'Nghe nội dung tiếng Anh vừa sức', detail: 'Chọn một bài nghe ngắn, nghe để hiểu ý chính và ghi lại vài cụm hữu ích.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe' },
  ],
  6: [
    { id: 'weekly-story', title: 'Ghi âm kể lại tuần này bằng tiếng Anh', detail: 'Nói khoảng 3 phút về việc bạn đã làm, điều thú vị và kế hoạch tuần sau.', minutes: 3, href: '/practice/speaking?mode=weekly-story', action: 'Mở phòng ghi âm' },
    { id: 'easy-listen', title: 'Đọc hoặc nghe nội dung vừa sức', detail: 'Chọn bài ngắn và tận hưởng việc hiểu được nhiều hơn mà không dừng ở mọi từ mới.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe' },
  ],
  0: [
    { id: 'weekly-story', title: 'Ghi âm kể lại tuần này bằng tiếng Anh', detail: 'Nói khoảng 3 phút về việc bạn đã làm, điều thú vị và kế hoạch tuần sau.', minutes: 3, href: '/practice/speaking?mode=weekly-story', action: 'Mở phòng ghi âm' },
    { id: 'easy-listen', title: 'Đọc hoặc nghe nội dung vừa sức', detail: 'Chọn bài ngắn và tận hưởng việc hiểu được nhiều hơn mà không dừng ở mọi từ mới.', minutes: 15, href: '/tests?skill=Listening', action: 'Chọn bài nghe' },
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
  minutes: 5,
}

function RoutineNotes({ task }: { task: RoutineNote }) {
  const { update } = useStudy()
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const vocabulary = task === 'new-words'
  const valid = countWords(first) >= (vocabulary ? 4 : 2) && countWords(second) >= 4
    && first.trim().toLowerCase() !== second.trim().toLowerCase()
  return <details className="routine-notes">
    <summary>{vocabulary ? 'Viết hai câu' : 'Ghi lại cụm từ'}</summary>
    <form className="stack" onSubmit={event => {
      event.preventDefault()
      if (valid) update(previous => saveRoutineNote(previous, task, [first, second]))
    }}>
      <label>{vocabulary ? 'Câu thứ nhất' : 'Cụm từ bạn bị khựng'}
        <input value={first} onChange={event => setFirst(event.target.value)} maxLength={600} />
      </label>
      <label>{vocabulary ? 'Câu thứ hai' : 'Câu bạn muốn nói'}
        <input value={second} onChange={event => setSecond(event.target.value)} maxLength={600} />
      </label>
      <small>{vocabulary ? 'Viết hai câu khác nhau, ít nhất 4 từ mỗi câu.' : 'Ghi một cụm ít nhất 2 từ và một câu ít nhất 4 từ.'}</small>
      <button className="primary" disabled={!valid}>Lưu bài luyện</button>
    </form>
  </details>
}

export function FluencyPlan({ weekday, dateKey }: { weekday: number; dateKey: string }) {
  const { state } = useStudy()
  const tasks = [...weeklySchedule[weekday], dailyTask]
  const date = new Date(dateKey + 'T12:00:00')
  const dateLabel = new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long' }).format(date)
  const completedSkills = new Set(state.attempts.filter(attempt => dayKey(new Date(attempt.at)) === dateKey).flatMap(attempt => {
    const exam = exams.find(item => item.id === attempt.examId)
    return exam && hasExamCredit(exam, attempt.draft.answers) ? [exam.skill] : []
  }))
  function isDone(task: RoutineId) {
    if (task === 'easy-listen') return completedSkills.has('Listening') || (weekday === 0 || weekday === 6) && completedSkills.has('Reading')
    if (task === 'read-easy') return completedSkills.has('Reading')
    return Boolean(state.routineWork[dateKey]?.[task])
  }
  const doneCount = tasks.filter(task => isDone(task.id)).length
  const totalMinutes = tasks.reduce((sum, task) => sum + task.minutes, 0)

  return <section className="panel daily-routine" aria-labelledby="daily-routine-title">
    <div className="daily-routine-heading">
      <div><p className="overline">KẾ HOẠCH HÔM NAY · {dateLabel.toLocaleUpperCase('vi-VN')}</p>
        <h2 id="daily-routine-title">{dayNames[weekday]}: học gì hôm nay?</h2>
        <p className="muted">Web tự đánh dấu xong khi bạn đạt điều kiện của từng nhiệm vụ.</p>
      </div>
      <div className="daily-routine-total"><strong>{doneCount}/{tasks.length}</strong><span>nhiệm vụ · khoảng {totalMinutes} phút</span></div>
    </div>
    <progress value={doneCount} max={tasks.length} aria-label="Nhiệm vụ trong lịch hôm nay đã hoàn thành" />
    <div className="daily-routine-list">
      {tasks.map((task, index) => {
        const { id } = task
        const done = isDone(id)
        const notes = id === 'new-words' || id === 'self-talk'
        return <article className="daily-routine-task" key={task.id} data-done={done}>
          <span className="daily-routine-index" aria-hidden="true">{done ? '✓' : String(index + 1).padStart(2, '0')}</span>
          <div className="daily-routine-copy">
            <div className="row"><h3>{task.title}</h3><span className="pill">{task.minutes} phút</span></div>
            <p>{task.detail}</p>
            {!done && !notes && <small>{{
              'speak-432': 'Ghi đủ nửa thời lượng ở 2 trong 3 lượt cùng một đề.',
              'weekly-story': 'Lưu một bản ghi từ 1 phút 30 giây.',
              'easy-listen': 'Trả lời ít nhất nửa số câu rồi nộp bài.',
              'read-easy': 'Trả lời ít nhất nửa số câu rồi nộp bài.'
            }[id]}</small>}
            {!done && notes && <RoutineNotes task={id} />}
            {done && notes && <details className="routine-notes"><summary>Xem ghi chú đã lưu</summary>
              {state.routineWork[dateKey]?.[id]?.map(note => <p key={note}>{note}</p>)}
            </details>}
          </div>
          <div className="daily-routine-actions">
            {task.href && <Link className="button daily-routine-open" to={task.href}>{task.action}</Link>}
            {task.id === 'easy-listen' && (weekday === 0 || weekday === 6) && <Link className="button daily-routine-open" to="/tests?skill=Reading">Chọn bài đọc</Link>}
            {done && <span className="routine-complete" role="status">Đã xong</span>}
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
