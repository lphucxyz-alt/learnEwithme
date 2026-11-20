import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStudy } from '../../app/StudyProvider'
import { seedCard } from '../../services/srs'
import type { Exam } from '../../types/exam'
import type { Draft, StudyState } from '../../types/study'
import { clockLabel, dayKey, record } from '../discipline/activity'
import { useNow } from '../discipline/FocusTimer'
import { examProgress, hasExamCredit, minimumWork } from '../discipline/study-credit'
import { bandEstimate, evidence, examChoices, matches, questionsOf, scoreExam } from './catalog'
import { Reading } from './Reading'
import { Listening } from './Listening'
import { Writing } from './Writing'
import { Speaking } from './Speaking'

export function ExamSession({ exam }: { exam: Exam }) {
  const { state, update } = useStudy()
  const navigate = useNavigate()
  const now = useNow()
  const draft = state.drafts[exam.id]
  const progress = examProgress(exam, draft?.answers ?? {})
  const ready = hasExamCredit(exam, draft?.answers ?? {})
  function submit() {
    const now = Date.now()
    const attemptId = crypto.randomUUID()
    update(previous => {
      const current = previous.drafts[exam.id]
      if (!current) return previous
      const { score, total, errors } = scoreExam(exam, current)
      const drafts = { ...previous.drafts }
      delete drafts[exam.id]
      const hasWork = hasExamCredit(exam, current.answers)
      const cards = { ...previous.cards }
      const finished = Math.min(now, current.deadline)
      const day = dayKey(new Date(finished))
      if (hasWork) for (const error of errors) cards[error.id] = { ...seedCard(error, cards[error.id]), due: day }
      const seconds = Math.max(0, Math.round((finished - current.deadline + exam.seconds * 1000) / 1000))
      const updated = hasWork ? record(previous, 'tests', 15 + (score ?? 0) * 3, seconds, day) : previous
      return { ...updated, drafts, cards,
        attempts: [{ id: attemptId, examId: exam.id, at: new Date(finished).toISOString(), score, total, draft: current }, ...previous.attempts] }
    })
    navigate('/tests/' + exam.id + '/history')
  }
  useEffect(() => { if (draft && draft.deadline <= now) submit() }, [draft, now])
  function patch(changes: Partial<Draft>) {
    update(previous => {
      const current = previous.drafts[exam.id]
      if (!current || current.deadline <= Date.now()) return previous
      return { ...previous, drafts: { ...previous.drafts, [exam.id]: { ...current, ...changes } } }
    })
  }
  function start() {
    const empty: Draft = { deadline: Date.now() + exam.seconds * 1000, answers: {}, ratings: {}, highlights: [] }
    update(previous => previous.drafts[exam.id] ? previous : { ...previous, drafts: { ...previous.drafts, [exam.id]: empty } })
  }
  const questions = <section className="panel stack"><h2>Câu hỏi</h2>{questionsOf(exam).map((question, index) => {
    const choices = examChoices(question, draft?.deadline ?? 0)
    const value = draft?.answers[question.id] ?? ''
    function set(value: string) { patch({ answers: { ...draft?.answers, [question.id]: value } }) }
    return <fieldset className="question" key={question.id}>
      <legend>{index + 1}. {question.prompt}</legend>
      {question.kind === 'gap' ? <input aria-label={'Đáp án câu ' + (index + 1)} value={value} onChange={event => set(event.target.value)} /> : choices?.map(choice =>
        <label key={choice}><input type="radio" name={question.id} checked={choice === value} onChange={() => set(choice)} /> {choice}</label>)}
    </fieldset>
  })}</section>
  return <>
    <header className="page-head"><Link className="text-link" to="/tests">Kho đề</Link><h1>{exam.title}</h1><p>{exam.skill} · {exam.collection} · {Math.ceil(exam.seconds / 60)} phút</p></header>
    {draft ? <>
      <div className="panel exam-bar between">
        <div><strong>Còn {clockLabel(Math.max(0, Math.ceil((draft.deadline - now) / 1000)))}</strong>
          <p className="muted">{progress.answered}/{progress.total} {progress.unit} đã làm · Tối thiểu {minimumWork(progress.total)} để nộp</p></div>
        <button className="primary" disabled={!ready} onClick={submit}>Nộp bài</button>
        {!ready && exam.skill === 'Writing' && <small>Một bài viết được tính khi đạt 75 từ ở Task 1 hoặc 125 từ ở Task 2.</small>}
        {!ready && exam.skill === 'Speaking' && <small>Mỗi phần cần bản ghi dài ít nhất 30 giây.</small>}
      </div>
      {exam.skill === 'Reading' && <Reading paragraphs={exam.paragraphs} highlights={draft.highlights} patch={highlights => patch({ highlights })}>{questions}</Reading>}
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
    </> : <section className="panel row"><button className="primary" onClick={start}>Bắt đầu làm bài</button><Link className="button" to={'/tests/' + exam.id + '/history'}>Lịch sử</Link></section>}
  </>
}

export function ExamHistory({ exam, attempts, selected }: { exam: Exam; attempts: StudyState['attempts']; selected?: string }) {
  const attempt = attempts.find(item => item.id === selected) ?? attempts[0]
  const credited = attempt && hasExamCredit(exam, attempt.draft.answers)
  return <>
    <header className="page-head"><Link className="text-link" to="/tests">Kho đề</Link><h1>{exam.title}</h1><p>Lịch sử bài làm</p></header>
    <section className="panel stack">
      {attempts.length === 0 && <p>Bạn chưa nộp bài này.</p>}
      <div className="row">{attempts.map(item => <Link className="button" aria-current={item.id === attempt?.id ? 'true' : undefined} key={item.id} to={'/tests/' + exam.id + '/history/' + item.id}>
        {new Date(item.at).toLocaleString('vi')} {item.score === null ? '' : '· ' + item.score + '/' + item.total}</Link>)}</div>
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
      return <article className="catalog-item" key={question.id}><h3>{index + 1}. {question.prompt}</h3>
        <p className={matches(question, response) ? 'answer' : 'error'}>Bạn chọn {response || '—'} · Đáp án {question.answers.join(' / ')}</p>
        <p>{question.explanation}</p><blockquote>{evidence(exam, question.evidence)}</blockquote></article>
    })}</section>}
  </>
}
