import type { GrammarQuestion, Lesson } from '../../data/foundations'
import { shuffle } from '../../services/random'

export type GrammarTaskMode = 'choice' | 'gap' | 'correction' | 'word-order'

export interface GrammarTask extends GrammarQuestion {
  mode: GrammarTaskMode
  displayedPrompt?: string
  topicTitle: string
}

const modes: GrammarTaskMode[] = ['choice', 'gap', 'correction', 'word-order']

type QuestionSource = { question: GrammarQuestion; topicTitle: string }

export function createLessonQuiz(lesson: Lesson, size = 20, questionBank: QuestionSource[] = lesson.questions.map(question => ({ question, topicTitle: lesson.title }))): GrammarTask[] {
  const bank = questionBank.length ? questionBank : lesson.questions.map(question => ({ question, topicTitle: lesson.title }))
  const tasks = Array.from({ length: size }, (_, index) => {
    const { question: source, topicTitle } = bank[index % bank.length]
    const mode = modes[index % modes.length] === 'word-order' && source.answer.trim().split(/\s+/).length < 2
      ? 'correction'
      : modes[index % modes.length]
    const attempt = Math.floor(index / bank.length) + 1
    return {
      ...source,
      id: `${source.id}-practice-${attempt}-${mode}`,
      mode,
      topicTitle,
      displayedPrompt: mode === 'correction'
        ? source.prompt.replace('___', source.distractors[0])
        : undefined,
    }
  })
  return shuffle(tasks)
}
