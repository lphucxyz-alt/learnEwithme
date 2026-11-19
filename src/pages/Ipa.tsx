import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AudioSandbox, Listen } from '../components/Audio'
import sources from '../data/phoneme-sources.json'
import { useStudy } from '../app/StudyProvider'
import { playRecording } from '../services/audio'
import { leastRecent, rememberPractice } from '../services/random'
import { pairs, sounds, vietnameseTips } from '../data/ipa'
import { EarDrill } from '../features/ipa/EarDrill'
import { Mouth } from '../features/ipa/Mouth'

export default function Ipa() {
  const { state, update } = useStudy()
  const [audioStatus, setAudioStatus] = useState('')
  const [params, setParams] = useSearchParams()
  const sound = sounds.find(item => item.symbol === params.get('sound')) ?? sounds[0]
  const [pair, setPair] = useState(0)
  const [round, setRound] = useState(0)

  // Ghi âm đối chiếu tức thì cho người học
  const [isRecording, setIsRecording] = useState(false)
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (userAudioUrl) URL.revokeObjectURL(userAudioUrl)
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [userAudioUrl])

  function randomPair() {
    const key = (index: number) => 'ipa:' + pairs[index].words.join(':')
    const [next] = leastRecent(pairs.map((_, index) => index).filter(index => index !== pair), 1, key, state.recentPractice)
    update(previous => ({ ...previous, recentPractice: rememberPractice(previous.recentPractice, [key(next)]) }))
    setPair(next)
    setRound(value => value + 1)
  }

  function isolated() {
    const file = [...sound.symbol].map(character => character.codePointAt(0)!.toString(16)).join('-') + '.mp3'
    const fallback = () => {
      setAudioStatus('Mẫu tổng hợp /' + sound.symbol + '/')
      playRecording(import.meta.env.BASE_URL + 'phonemes/' + file, state.rate, () => setAudioStatus('Không phát được mẫu âm.'))
    }
    const source = (sources as Record<string, string | undefined>)[sound.symbol]
    if (!source) { fallback(); return }
    setAudioStatus('Bản thu IPA /' + sound.symbol + '/')
    playRecording('https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/' + source, state.rate, fallback)
  }

  async function toggleRecordUser() {
    if (isRecording) {
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data) }
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        setIsRecording(false)
        if (chunks.length) {
          if (userAudioUrl) URL.revokeObjectURL(userAudioUrl)
          const blob = new Blob(chunks, { type: recorder.mimeType })
          setUserAudioUrl(URL.createObjectURL(blob))
        }
      }

      recorderRef.current = recorder
      recorder.start()
      setIsRecording(true)

      // Tự động dừng sau 3.5 giây để tránh ghi âm quá dài
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
      }, 3500)
    } catch {
      alert('Không thể mở micro. Vui lòng cấp quyền micro cho trình duyệt.')
    }
  }

  function playUserRecording() {
    if (!userAudioUrl) return
    const audio = new Audio(userAudioUrl)
    audio.play().catch(() => {})
  }

  const tip = vietnameseTips[sound.symbol]

  return <>
    <header className="page-head">
      <p className="overline">PHÁT ÂM</p>
      <h1>Phòng lab IPA chuẩn 44 âm</h1>
      <p>Khảo sát khẩu hình trực quan, nghe mẫu bản xứ và đối chiếu giọng bạn ngay lập tức.</p>
    </header>

    <div className="split">
      <section className="panel stack">
        <h2>Bảng 44 ký hiệu IPA</h2>
        {[...new Set(sounds.map(item => item.group))].map(group =>
          <div key={group}>
            <h3>{group}</h3>
            <div className="sound-grid">
              {sounds.filter(item => item.group === group).map(item =>
                <button
                  key={item.symbol}
                  aria-pressed={sound.symbol === item.symbol}
                  onClick={() => {
                    setAudioStatus('')
                    setUserAudioUrl(null)
                    setParams({ sound: item.symbol }, { replace: true })
                  }}
                >
                  {item.symbol}
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="panel stack">
        <div className="between">
          <h2>/{sound.symbol}/ · Từ mẫu: <span className="formula">{sound.word}</span></h2>
          <Listen text={sound.word} label="Nghe từ mẫu" />
        </div>

        <Mouth sound={sound} />

        {/* Thanh tương tác nghe mẫu và thu âm đối chiếu */}
        <div className="row" style={{ alignItems: 'center', gap: '0.6rem' }}>
          <button className="primary" onClick={isolated}>
            🔊 Nghe âm mẫu /{sound.symbol}/
          </button>

          <button
            className="button"
            type="button"
            onClick={toggleRecordUser}
            style={{
              borderColor: isRecording ? '#ef4444' : undefined,
              color: isRecording ? '#ef4444' : undefined,
              background: isRecording ? 'rgba(239, 68, 68, 0.12)' : undefined
            }}
          >
            {isRecording ? '⏹ Đang thu (bấm để dừng)...' : '🎙️ Thu âm thử giọng bạn'}
          </button>

          {userAudioUrl && !isRecording && (
            <button className="button" type="button" onClick={playUserRecording}>
              ▶ Nghe lại giọng bạn
            </button>
          )}

          {audioStatus && <small role="status">{audioStatus}</small>}
        </div>

        {/* Thẻ Mẹo thực chiến cho người Việt */}
        {tip && (
          <div
            className="panel"
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              borderColor: 'rgba(99, 102, 241, 0.25)',
              padding: '0.85rem 1.1rem'
            }}
          >
            <div className="row" style={{ marginBottom: '0.35rem' }}>
              <span className="pill" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent)' }}>
                💡 Mẹo thực chiến dễ nhớ
              </span>
            </div>
            <p style={{ margin: 0, fontWeight: 550, color: 'var(--text)', lineHeight: 1.5 }}>
              {tip}
            </p>
          </div>
        )}

        <div className="stack" style={{ gap: '0.4rem' }}>
          <p><strong>Cơ chế:</strong> {sound.instruction}</p>
          <p className="muted"><strong>Lỗi hay gặp:</strong> {sound.mistake}</p>
        </div>

        <a className="text-link" href="https://www.internationalphoneticassociation.org/content/sound-recordings" target="_blank" rel="noreferrer">
          Bản thu tham khảo của Hiệp hội Ngữ âm Quốc tế
        </a>

        {pairs.filter(item => item.sounds.includes(sound.symbol)).map(item =>
          <button
            key={item.words.join(':')}
            className="button"
            onClick={() => {
              setPair(pairs.indexOf(item))
              setRound(value => value + 1)
              document.getElementById('ear')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Luyện phân biệt cặp /{item.sounds.join('/ – /')}/ ({item.words.join(' / ')})
          </button>
        )}
      </section>
    </div>

    <section id="ear" className="panel stack">
      <div className="between">
        <h2>Luyện nghe phân biệt <span className="pill">{pairs.length} cặp âm</span></h2>
        <select aria-label="Cặp âm" value={pair} onChange={event => setPair(Number(event.target.value))}>
          {pairs.map((item, index) => <option key={item.words.join(':')} value={index}>/{item.sounds.join('/ – /')}/ · {item.words.join(' / ')}</option>)}
        </select>
        <button className="button" onClick={randomPair}>Cặp âm ngẫu nhiên</button>
      </div>
      <EarDrill key={pair + ':' + round} pair={pairs[pair]} done={() => setRound(value => value + 1)} />
    </section>

    <AudioSandbox />
  </>
}
