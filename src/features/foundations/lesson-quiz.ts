import type { GrammarQuestion, Lesson } from '../../data/foundations'
import { shuffle } from '../../services/random'

export type GrammarTaskMode = 'choice' | 'gap' | 'correction' | 'word-order'

export interface GrammarTask extends GrammarQuestion {
  mode: GrammarTaskMode
  displayedPrompt?: string
}

const modes: GrammarTaskMode[] = ['choice', 'gap', 'correction', 'word-order']

export function createLessonQuiz(lesson: Lesson, size = 20): GrammarTask[] {
  const tasks = Array.from({ length: size }, (_, index) => {
    const source = lesson.questions[index % lesson.questions.length]
    const mode = modes[index % modes.length] === 'word-order' && source.answer.trim().split(/\s+/).length < 2
      ? 'correction'
      : modes[index % modes.length]
    const attempt = Math.floor(index / lesson.questions.length) + 1
    return {
      ...source,
      id: `${source.id}-practice-${attempt}-${mode}`,
      mode,
      displayedPrompt: mode === 'correction'
        ? source.prompt.replace('___', source.distractors[0])
        : undefined,
    }
  })
  return shuffle(tasks)
}
