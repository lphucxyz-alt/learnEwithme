import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStudy } from '../../app/StudyProvider'
import type { Exam } from '../../types/exam'
import type { Draft, StudyState } from '../../types/study'
import { clockLabel, formatVietnamDate } from '../discipline/activity'
import { useNow } from '../discipline/FocusTimer'
import { examProgress, hasAnswer, hasExamCredit, minimumWork } from '../discipline/study-credit'
import { bandEstimate, evidence, examChoices, matches, questionsOf } from './catalog'
import { finishExam, hasExamResponse } from './exam-attempt'
import { useExamTime } from './useExamTime'
import { Reading } from './Reading'
import { Listening } from './Listening'
import { Writing } from './Writing'
import { Speaking } from './Speaking'

export function ExamSession({ exam }: { exam: Exam }) {
  const { state, update } = useStudy()
  const navigate = useNavigate()
  const now = useNow()
  const draft = state.drafts[exam.id]
  const deadline = draft?.deadline
  const finishing = useRef<number>(undefined)
  const [emptyExpired, setEmptyExpired] = useState(false)
  const saveTime = useCallback((time: number) => {
    update(previous => {
      const current = previous.drafts[exam.id]
      if (!current || current.deadline !== deadline) return previous
      const activeMs = Math.min(exam.seconds * 1000, (current.activeMs ?? 0) + time)
      return { ...previous, drafts: { ...previous.drafts, [exam.id]: { ...current, activeMs } } }
    })
  }, [deadline, exam.id, exam.seconds, update])
  const takePendingTime = useExamTime(deadline, saveTime)
  const progress = examProgress(exam, draft?.answers ?? {})
  const ready = hasExamCredit(exam, draft?.answers ?? {})
  function submit() {
    const submittedAt = Date.now()
    if (!draft || finishing.current === draft.deadline || !ready && submittedAt < draft.deadline) return
    finishing.current = draft.deadline
    const attemptId = crypto.randomUUID()
    const additionalMs = takePendingTime()
    update(previous => finishExam(previous, exam, { attemptId, now: submittedAt, deadline: draft.deadline, additionalMs }))
    if (hasExamResponse(exam, draft.answers)) navigate('/tests/' + exam.id + '/history/' + attemptId, { replace: true })
    else setEmptyExpired(true)
  }
  useEffect(() => { if (draft && draft.deadline <= now) submit() }, [draft, now])
  function patch(changes: Partial<Draft>) {
    update(previous => {
      const current = previous.drafts[exam.id]
      if (!current || current.deadline <= Date.now()) return previous
      const next = { ...current, ...changes }
      if (changes.answers) next.answers = { ...current.answers, ...changes.answers }
      if (changes.ratings) next.ratings = { ...current.ratings, ...changes.ratings }
      return { ...previous, drafts: { ...previous.drafts, [exam.id]: next } }
    })
  }
  function start() {
    setEmptyExpired(false)
    const empty: Draft = { deadline: Date.now() + exam.seconds * 1000, answers: {}, ratings: {}, highlights: [] }
    update(previous => previous.drafts[exam.id] ? previous : { ...previous, drafts: { ...previous.drafts, [exam.id]: empty } })
  }
  const questions = <section className="panel stack"><h2>Câu hỏi</h2>{questionsOf(exam).map((question, index) => {
    const choices = examChoices(question, draft?.deadline ?? 0)
    const value = draft?.answers[question.id] ?? ''
    function set(value: string) { patch({ answers: { [question.id]: value } }) }
    return <fieldset className="question" key={question.id}>
      <legend>{index + 1}. {question.prompt}</legend>
      {question.kind === 'gap' ? <input aria-label={'Đáp án câu ' + (index + 1)} value={value} onChange={event => set(event.target.value)} /> : choices?.map(choice =>
        <label key={choice}><input type="radio" name={question.id} checked={choice === value} onChange={() => set(choice)} /> {choice}</label>)}
    </fieldset>
  })}</section>
  const toolbar = draft && <div className="panel exam-bar between">
    <div><strong>Còn {clockLabel(Math.max(0, Math.ceil((draft.deadline - now) / 1000)))}</strong>
      <p className="muted">{progress.answered}/{progress.total} {progress.unit} đã làm · Tối thiểu {minimumWork(progress.total)} để nộp</p></div>
    <button className="primary" disabled={!ready} onClick={submit}>Nộp bài</button>
    {!ready && exam.skill === 'Writing' && <small>Một bài viết được tính khi đạt 75 từ ở Task 1 hoặc 125 từ ở Task 2.</small>}
    {!ready && exam.skill === 'Speaking' && <small>Mỗi phần cần bản ghi dài ít nhất 30 giây.</small>}
  </div>
  return <>
    <header className="page-head"><Link className="text-link" to="/tests">Kho đề</Link><h1>{exam.title}</h1><p>{exam.skill} · {exam.collection} · {Math.ceil(exam.seconds / 60)} phút</p></header>
    {draft ? <>
      {exam.skill !== 'Reading' && <div className="exam-toolbar">{toolbar}</div>}
      {exam.skill === 'Reading' && <Reading toolbar={toolbar} paragraphs={exam.paragraphs} highlights={draft.highlights} patch={highlights => patch({ highlights })}>{questions}</Reading>}
      {exam.skill === 'Listening' && <><Listening turns={exam.turns} />{questions}</>}
      {exam.skill === 'Writing' && <Writing tasks={exam.tasks} draft={draft} patch={patch} review={false} />}
      {exam.skill === 'Speaking' && <Speaking parts={exam.parts} onRecording={(part, seconds) => {
        update(previous => {
          const current = previous.drafts[exam.id]
          if (!current || current.deadline <= Date.now()) return previous
          const key = 'part-' + (part + 1)
          const longest = Math.max(seconds, Number(current.answers[key] ?? 0))
          return { ...previous, drafts: { ...previous.drafts, [exam.id]: { ...current, answers: { ...current.answers, [key]: String(longest) } } } }
        })
      }} />}
    </> : <section className="panel stack">
      {emptyExpired && <p role="status">Đã hết giờ. Bạn có thể bắt đầu lại khi sẵn sàng.</p>}
      <div className="row"><button className="primary" onClick={start}>Bắt đầu làm bài</button><Link className="button" to={'/tests/' + exam.id + '/history'}>Lịch sử</Link></div>
    </section>}
  </>
}

export function ExamHistory({ exam, attempts, selected }: { exam: Exam; attempts: StudyState['attempts']; selected?: string }) {
  const attempt = selected ? attempts.find(item => item.id === selected) : attempts[0]
  const credited = attempt && hasExamCredit(exam, attempt.draft.answers)
  return <>
    <header className="page-head"><Link className="text-link" to="/tests">Kho đề</Link><h1>{exam.title}</h1><p>Lịch sử bài làm</p></header>
    <section className="panel stack">
      {attempts.length === 0 && <p>Bạn chưa nộp bài này.</p>}
      {selected && !attempt && attempts.length > 0 && <p>Không tìm thấy lần làm bài này. Chọn một lần trong lịch sử để xem.</p>}
      <div className="row">{attempts.map(item => <Link className="button" aria-current={item.id === attempt?.id ? 'true' : undefined} key={item.id} to={'/tests/' + exam.id + '/history/' + item.id}>
        {formatVietnamDate(new Date(item.at), { dateStyle: 'short', timeStyle: 'short' })} {item.score === null ? '' : '· ' + item.score + '/' + item.total}</Link>)}</div>
      <Link className="text-link" to={'/tests/' + exam.id}>Mở đề</Link>
      {attempt && !credited && <p>Chưa đủ phần đã làm để ghi nhận hoàn thành. Bạn vẫn có thể xem lại bài.</p>}
      {credited && attempt.score !== null && <strong>{attempt.score}/{attempt.total} đúng · band quy đổi tham khảo {bandEstimate(attempt.score, attempt.total)}</strong>}
      {credited && attempt.score === null && <p>Bài đã nộp · Kỹ năng này dùng tự đánh giá.</p>}
    </section>
    {attempt && exam.skill === 'Writing' && <Writing key={attempt.id} tasks={exam.tasks} draft={attempt.draft} review />}
    {attempt && exam.skill === 'Speaking' && <>
      {Object.entries(attempt.draft.answers).some(([key]) => key.startsWith('part-')) && <section className="panel stack"><h2>Thời lượng đã ghi</h2>
        <p>{Object.entries(attempt.draft.answers).filter(([key]) => key.startsWith('part-')).sort().map(([key, seconds]) =>
          'Part ' + key.slice(5) + ' · ' + seconds + ' giây').join(' / ')}</p>
      </section>}
      <Speaking parts={exam.parts} />
    </>}
    {attempt && exam.skill === 'Listening' && <Listening turns={exam.turns} review />}
    {attempt && questionsOf(exam).length > 0 && <section className="panel stack"><h2>Lời giải</h2>{questionsOf(exam).map((question, index) => {
      const response = attempt.draft.answers[question.id] ?? ''
      if (!credited && !hasAnswer(response)) return null
      return <article className="catalog-item" key={question.id}><h3>{index + 1}. {question.prompt}</h3>
        <p className={matches(question, response) ? 'answer' : 'error'}>Bạn chọn {response || '—'} · Đáp án {question.answers.join(' / ')}</p>
        <p>{question.explanation}</p><blockquote>{evidence(exam, question.evidence)}</blockquote></article>
    })}</section>}
  </>
}
