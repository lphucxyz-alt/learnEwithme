import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AudioSandbox, Listen } from '../components/Audio'
import sources from '../data/phoneme-sources.json'
import { useStudy } from '../app/StudyProvider'
import { playRecording } from '../services/audio'
import { leastRecent, rememberPractice } from '../services/random'
import { pairs, sounds } from '../data/ipa'
import { EarDrill } from '../features/ipa/EarDrill'
import { Mouth } from '../features/ipa/Mouth'
import { IpaTipCard, VoiceMirror } from '../features/ipa/VoiceMirror'
import { IpaIllustratedGuide } from '../features/ipa/IpaIllustratedGuide'

export default function Ipa() {
  const { state, update } = useStudy()
  const [audioStatus, setAudioStatus] = useState('')
  const [params, setParams] = useSearchParams()
  const sound = sounds.find(item => item.symbol === params.get('sound')) ?? sounds[0]
  const [pair, setPair] = useState(0)
  const [round, setRound] = useState(0)
  const [earPosition, setEarPosition] = useState(0)
  const [earScore, setEarScore] = useState(0)
  const [earStarted, setEarStarted] = useState(false)

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

  return <>
    <header className="page-head">
      <p className="overline">PHÁT ÂM</p>
      <h1>Phòng lab IPA chuẩn 44 âm</h1>
      <p>Học khẩu hình từ hình minh họa, nghe từng âm và tự ghi âm để luyện chắc phát âm.</p>
    </header>

    <IpaIllustratedGuide onSelectSound={symbol => {
      setAudioStatus('')
      setParams({ sound: symbol })
      window.setTimeout(() => document.getElementById('ipa-sound-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }} />

    <div className="split">
      <section className="panel stack" id="ipa-sound-lab">
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

        <div className="ipa-ux-bridge">
          <VoiceMirror
            symbol={sound.symbol}
            onPlaySample={isolated}
          />
          <IpaTipCard symbol={sound.symbol} />
        </div>

        <div className="stack" style={{ gap: '0.4rem' }}>
          <p><strong>Cơ chế:</strong> {sound.instruction}</p>
          <p className="muted"><strong>Lỗi hay gặp:</strong> {sound.mistake}</p>
          {audioStatus && <small role="status">{audioStatus}</small>}
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
      {!earStarted && <><p className="muted">Một lượt gồm 20 câu nghe ngẫu nhiên các cặp âm, có tính điểm và lưu câu sai để ôn lại.</p><button className="primary" onClick={() => { setEarStarted(true); setEarPosition(0); setEarScore(0); setRound(value => value + 1) }}>Bắt đầu 20 câu</button></>}
      {earStarted && earPosition < 20 && <><span className="pill">{earPosition + 1}/20</span><EarDrill key={pair + ':' + round} pair={pairs[pair]} done={correct => {
        setEarScore(value => value + Number(correct))
        setEarPosition(value => value + 1)
        randomPair()
      }} /></>}
      {earStarted && earPosition === 20 && <div role="status" className="stack"><p>Kết quả: <strong>{earScore}/20</strong>. Câu sai đã được thêm vào hàng đợi ôn.</p><button className="primary" onClick={() => { setEarStarted(false); setEarPosition(0); setEarScore(0) }}>Luyện lại 20 câu</button></div>}
    </section>

    <AudioSandbox />
  </>
}
