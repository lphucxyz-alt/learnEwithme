import { lessons } from '../../data/foundations/catalog'
import { exams } from '../tests/catalog'
import type { StudyState } from '../../types/study'

const foundationalOrder = [
  'articles-indefinite', 'articles-definite', 'time-prepositions', 'place-prepositions',
  'be-subjects', 'present-simple', 'past-simple', 'questions', 'present-perfect'
]
export const starterExamIds = ['repair-library', 'community-pool', 'study-routines', 'library-and-learning']
const starterLessons = foundationalOrder.flatMap(id => lessons.filter(lesson => lesson.id === id))
const starterExams = starterExamIds.flatMap(id => exams.filter(exam => exam.id === id))

export function getStudyPlan(state: StudyState) {
  const remainingLessons = starterLessons.filter(lesson =>
    ((state.lessons[lesson.id]?.best ?? 0) / (state.lessons[lesson.id]?.total ?? lesson.questions.length)) < 0.65)
  const firstLesson = remainingLessons[0]
  const firstExam = starterExams.find(exam => !state.attempts.some(attempt => attempt.examId === exam.id
    && Object.values(attempt.draft.answers).some(answer => answer.trim())))
  const basicsDone = starterLessons.length - remainingLessons.length
  if (firstLesson) return {
    basicsDone, basicsTotal: starterLessons.length, title: firstLesson.title,
    path: '/foundations/' + firstLesson.id, label: 'Học bài này',
    detail: 'Đọc ví dụ, rồi làm ' + firstLesson.questions.length + ' câu.'
  }
  if (firstExam) return {
    basicsDone, basicsTotal: starterLessons.length, title: firstExam.skill + ' · ' + firstExam.title,
    path: '/tests/' + firstExam.id, label: 'Mở bài luyện',
    detail: firstExam.skill === 'Writing' ? 'Bắt đầu với Task 1. Đọc đề rồi phác thảo vài ý.' : 'Làm một bài ngắn rồi xem lại.'
  }
  return {
    basicsDone, basicsTotal: starterLessons.length, title: 'Ôn lại trong 5 phút',
    path: '/practice', label: 'Mở luyện nhanh', detail: 'Ôn câu sai và làm vài câu nền tảng.'
  }
}
