import { useState } from 'react'
import { CoachReview } from '../coach/CoachReview'
import { Listen } from '../../components/Audio'
import type { Draft } from '../../types/study'
import type { Exam } from '../../types/exam'

const criteria = [
  ['TA/TR', 'Trả lời đúng yêu cầu, phát triển các ý chính.'],
  ['CC', 'Tổ chức ý hợp lý và liên kết đoạn rõ ràng.'],
  ['LR', 'Dùng từ chính xác, phù hợp chủ đề và văn phong.'],
  ['GRA', 'Dùng đa dạng cấu trúc và kiểm soát lỗi ngữ pháp.']
]

function writingId(task: string, answer: string) {
  let hash = 2166136261
  for (const character of task + '\n' + answer) hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619)
  return 'writing:' + (hash >>> 0).toString(36) + ':' + answer.length
}

export function Writing({ tasks, draft, patch, review }: {
  tasks: Extract<Exam, { skill: 'Writing' }>['tasks']; draft: Draft; patch?: (draft: Partial<Draft>) => void; review: boolean
}) {
  const [index, setIndex] = useState(0)
  const task = tasks[index]
  const id = 'task-' + index
  const answer = draft.answers[id] ?? ''
  const words = answer.trim().split(/\s+/).filter(Boolean).length
  return <div className="stack">
    <div className="row">{tasks.map((item, position) => <button key={item.title} aria-pressed={index === position} onClick={() => setIndex(position)}>{item.title}</button>)}</div>
    <div className="split"><section className="panel stack"><h2>{task.title}</h2><p>{task.prompt}</p>
      {review && <details><summary>Bài mẫu</summary><p>{task.sample}</p><Listen text={task.sample} /></details>}
      <h3>Tự đánh giá</h3>{criteria.map(([criterion, detail]) => <label key={criterion} className="rubric">
        <span><strong>{criterion}</strong> · {detail}</span>
        <select aria-label={criterion} disabled={!patch} value={draft.ratings[id + criterion] ?? 0} onChange={event => patch?.({ ratings: { ...draft.ratings, [id + criterion]: Number(event.target.value) } })}>
          <option value={0}>Chưa chấm</option>{Array.from({length: 21}, (_, slot) => 4 + slot * 0.25).filter(value => Number.isInteger(value * 2)).map(value => <option key={value}>{value}</option>)}
        </select>
      </label>)}
    </section><section className="panel stack"><h2>Bài viết của bạn</h2>
      <textarea aria-label={task.title} rows={17} readOnly={review} value={answer} onChange={event => patch?.({ answers: { ...draft.answers, [id]: event.target.value } })} />
      <p className={words < task.minWords ? 'error' : 'answer'}>{words} / {task.minWords} từ · {words < task.minWords ? 'Chưa đạt tối thiểu' : 'Đạt số từ tối thiểu'}</p>
    </section></div>
    {review && answer.trim() && <CoachReview key={writingId(task.title, answer)} id={writingId(task.title, answer)}
      exercise={{ mode: 'writing', topic: task.title, prompt: task.prompt, answer }} />}
  </div>
}
