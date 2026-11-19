type SpeechOptions = {
  boundary?: (index: number) => void
  end?: () => void
  error?: (message: string) => void
  loop?: boolean
}
type Accent = 'en-GB' | 'en-US'
let activeRecording: HTMLAudioElement | undefined
let activeLookup: AbortController | undefined
let generation = 0
const dictionary = new Map<string, string>()

export function stopAudio() {
  generation++
  activeLookup?.abort()
  activeLookup = undefined
  activeRecording?.pause()
  activeRecording = undefined
  if ('speechSynthesis' in window) window.speechSynthesis?.cancel()
}

function synthesise(text: string, accent: Accent, rate: number, options: SpeechOptions, request: number) {
  const engine = window.speechSynthesis
  if (!engine) {
    options.error?.('Trình duyệt này chưa hỗ trợ đọc văn bản.')
    return
  }
  const voices = engine.getVoices()
  const candidates = voices.filter(voice => voice.lang.replace('_', '-').toLowerCase() === accent.toLowerCase())
  const voice = candidates.find(item => /natural|premium|enhanced|neural/i.test(item.name)) ?? candidates[0]
  function play() {
    if (request !== generation) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = accent
    utterance.rate = rate
    if (voice) utterance.voice = voice
    utterance.onboundary = event => { if (request === generation) options.boundary?.(event.charIndex) }
    utterance.onend = () => {
      if (request !== generation) return
      if (options.loop) play()
      else options.end?.()
    }
    utterance.onerror = event => {
      if (request === generation && event.error !== 'canceled' && event.error !== 'interrupted') options.error?.('Không phát được. Hãy kiểm tra giọng đọc tiếng Anh trên thiết bị và thử lại.')
    }
    engine.speak(utterance)
  }
  play()
}

export function playRecording(url: string, rate: number, fallback: () => void, end?: () => void) {
  stopAudio()
  playFile(url, rate, generation, fallback, end)
}

function playFile(url: string, rate: number, request: number, fallback: () => void, end?: () => void) {
  const recording = new Audio(url)
  let failed = false
  function fail() {
    if (request !== generation || failed) return
    failed = true
    recording.pause()
    fallback()
  }
  activeRecording = recording
  recording.playbackRate = rate
  recording.onerror = fail
  recording.onended = () => { if (request === generation) end?.() }
  void recording.play().catch(fail)
}

export function speak(text: string, accent: Accent, rate: number, options: SpeechOptions = {}) {
  if (!text.trim()) return
  stopAudio()
  const request = generation
  synthesise(text, accent, rate, options, request)
}

export function speakWord(word: string, accent: Accent, rate: number, options: SpeechOptions = {}) {
  if (!/^[a-z]+$/i.test(word)) {
    speak(word, accent, rate, options)
    return
  }
  stopAudio()
  const request = generation
  const fallback = () => synthesise(word, accent, rate, options, request)
  const key = accent + ':' + word.toLowerCase()
  const cached = dictionary.get(key)
  if (cached) {
    playFile(cached, rate, request, fallback, options.end)
    return
  }
  const lookup = new AbortController()
  activeLookup = lookup
  const timeout = window.setTimeout(() => lookup.abort(), 1300)
  const region = accent === 'en-GB' ? 'uk|gb' : 'us'
  const filename = new RegExp('[-_](?:' + region + ')(?:[-_.]|$)', 'i')
  void fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word.toLowerCase()), { signal: lookup.signal })
    .then(async response => {
      if (!response.ok) throw new Error('No dictionary entry')
      const entries = await response.json() as { phonetics?: { audio?: string }[] }[]
      const files = entries.flatMap(entry => entry.phonetics ?? []).flatMap(entry => entry.audio ? [entry.audio] : [])
      const recording = files.find(file => filename.test(file) && /^(https:)?\/\//i.test(file))
      if (request !== generation) return
      if (!recording) { fallback(); return }
      dictionary.set(key, recording)
      playFile(recording, rate, request, fallback, options.end)
    }).catch(() => { if (request === generation) fallback() }).finally(() => clearTimeout(timeout))
}
