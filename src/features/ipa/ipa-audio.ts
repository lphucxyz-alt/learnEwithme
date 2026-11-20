import clips from '../../data/ipa-audio.json'
import type { StudyState } from '../../types/study'
import { playRecording, speakWord } from '../../services/audio'

type Options = { end?: () => void; error?: (message: string) => void }

export function playIpaWord(word: string, accent: StudyState['accent'], rate: StudyState['rate'], options: Options = {}) {
  const fallback = () => speakWord(word, accent, rate, options)
  if (!(clips.words as string[]).includes(word)) { fallback(); return }
  playRecording(import.meta.env.BASE_URL + `ipa-voice/${accent}/word-${word}.mp3`, rate, fallback, options.end)
}
