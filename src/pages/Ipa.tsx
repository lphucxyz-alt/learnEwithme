import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AudioSandbox } from '../components/Audio'
import sources from '../data/phoneme-sources.json'
import { useStudy } from '../app/StudyProvider'
import { playRecording, stopAudio } from '../services/audio'
import { leastRecent, rememberPractice } from '../services/random'
import { pairs, sounds } from '../data/ipa'
import { EarDrill } from '../features/ipa/EarDrill'
import { ArticulationLab, type ArticulationView } from '../features/ipa/ArticulationLab'
import { VoiceMirror } from '../components/VoiceMirror'
import { IpaIllustratedGuide } from '../features/ipa/IpaIllustratedGuide'
import { IpaWordPractice } from '../features/ipa/IpaWordPractice'
import { IpaListen } from '../features/ipa/IpaListen'
import { getIpaTip } from '../features/ipa/ipaTips'
import { dayKey } from '../features/discipline/activity'
import { minimumWork } from '../features/discipline/study-credit'

const earTotal = 20
const focusSounds = ['iː', 'ɪ', 'e', 'æ', 'ʊ', 'uː', 'θ', 'ð', 's', 'ʃ', 'tʃ', 'dʒ', 'n', 'ŋ', 'p', 'b']
const learningOrder = [...new Set([...focusSounds, ...sounds.map(item => item.symbol)])]
const soundGroups = [...new Set(sounds.map(item => item.group))]

function jumpTo(id: string) {
  const target = document.getElementById(id)
  target?.focus({ preventScroll: true })
  target?.scrollIntoView({ block: 'start' })
}

export default function Ipa() {
  const { state, update } = useStudy()
  const [audioStatus, setAudioStatus] = useState('')
  const [params, setParams] = useSearchParams()
  const [initialSymbol] = useState(() => learningOrder.find(symbol => !state.ipaLearned.includes(symbol)))
  const sound = sounds.find(item => item.symbol === (params.get('sound') ?? initialSymbol)) ?? sounds[0]
  const [view, setView] = useState<ArticulationView>(() => window.matchMedia('(max-width: 650px)').matches ? 'front' : 'both')
  const [pair, setPair] = useState(0)
  const [round, setRound] = useState(0)
  const [earPosition, setEarPosition] = useState(0)
  const [earScore, setEarScore] = useState(0)
  const [earStarted, setEarStarted] = useState(false)
  const relatedPairs = pairs.filter(item => item.sounds.includes(sound.symbol))
  const newSymbol = learningOrder.find(symbol => !state.ipaLearned.includes(symbol) && symbol !== sound.symbol)
  const today = dayKey()
  const dueSymbol = Object.values(state.cards).filter(card => card.id.startsWith('ipa-word:') && card.due <= today)
    .map(card => card.id.split(':')[1]).find(symbol => symbol !== sound.symbol && learningOrder.includes(symbol))
  const nextSymbol = dueSymbol ?? newSymbol
  const tip = getIpaTip(sound.symbol)
  const group = sounds.filter(item => item.group === sound.group)

  useEffect(() => stopAudio, [sound.symbol])

  function selectSound(symbol: string, jump = false) {
    setAudioStatus('')
    setParams({ sound: symbol }, { replace: true })
    if (jump) requestAnimationFrame(() => jumpTo('ipa-mouth'))
  }

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
      setAudioStatus('Đang dùng mẫu âm tổng hợp.')
      playRecording(import.meta.env.BASE_URL + 'phonemes/' + file, state.rate, () => setAudioStatus('Không phát được mẫu âm.'))
    }
    const source = (sources as Record<string, string | undefined>)[sound.symbol]
    if (!source) { fallback(); return }
    setAudioStatus('Bản mẫu của Hiệp hội Ngữ âm Quốc tế.')
    playRecording('https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/' + source, state.rate, fallback)
  }

  return <>
    <header className="page-head ipa-page-head">
      <div><p className="overline">PHÁT ÂM</p><h1>Phòng luyện IPA</h1><p>Quan sát khẩu hình, nghe âm rồi luyện với từ.</p></div>
      <div className="ipa-page-progress">
        <span><strong>{state.ipaLearned.length}/{sounds.length}</strong> âm đã luyện</span>
        <progress max={sounds.length} value={state.ipaLearned.length} aria-label="Số âm IPA đã luyện" />
      </div>
    </header>

    <div className="ipa-workspace">
      <section className="panel stack ipa-sound-map" id="ipa-sound-lab">
        <h2>Chọn âm</h2>
        <div className="ipa-group-switch" role="group" aria-label="Nhóm âm IPA">
          {soundGroups.map(name => <button key={name} type="button" aria-pressed={name === sound.group} onClick={() => {
            const first = sounds.find(item => item.group === name)
            if (name !== sound.group && first) selectSound(first.symbol)
          }}>{name}</button>)}
        </div>
        <div className="ipa-symbol-grid" role="group" aria-label={sound.group}>
          {group.map(item => <button key={item.symbol} type="button" aria-pressed={sound.symbol === item.symbol}
            data-learned={state.ipaLearned.includes(item.symbol)} aria-label={`Âm /${item.symbol}/, từ ${item.word}`}
            onClick={() => selectSound(item.symbol, window.matchMedia('(max-width: 960px)').matches)}>
            <strong>{item.symbol}</strong><small>{item.word}</small>
          </button>)}
        </div>
        {nextSymbol && <div className="ipa-next stack">
          <small>{dueSymbol ? 'Âm cần ôn' : 'Âm gợi ý tiếp theo'}</small>
          <button type="button" onClick={() => selectSound(nextSymbol, true)}>{dueSymbol ? 'Ôn' : 'Học'} /{nextSymbol}/</button>
        </div>}
        <div className="ipa-pair-links stack">
          <h3>Luyện nghe phân biệt</h3>
          {relatedPairs.slice(0, 2).map(item =>
            <button key={item.words.join(':')} type="button" onClick={() => {
              setPair(pairs.indexOf(item))
              setRound(value => value + 1)
              jumpTo('ear')
            }}>{item.words.join(' / ')}</button>
          )}
          <button type="button" onClick={() => jumpTo('ear')}>Luyện nghe 20 câu</button>
        </div>
      </section>

      <div className="stack ipa-lesson">
        <section className="panel stack ipa-lesson-panel" id="ipa-mouth" tabIndex={-1} aria-labelledby="ipa-articulation-heading">
          <div className="ipa-lesson-head">
            <div className="ipa-phoneme-badge" aria-hidden="true">/{sound.symbol}/</div>
            <div className="ipa-lesson-copy">
              <h2 id="ipa-articulation-heading">Khẩu hình /{sound.symbol}/</h2>
              <p>{sound.instruction}</p>
            </div>
          </div>
          <div className="row ipa-sound-actions">
            <button className="primary" type="button" onClick={isolated}>Nghe âm /{sound.symbol}/</button>
            <IpaListen key={sound.symbol} text={sound.word} label={'Nghe ' + sound.word} />
            <select value={state.accent} aria-label="Giọng đọc từ mẫu" onChange={event => {
              stopAudio()
              const accent = event.target.value as typeof state.accent
              update(previous => ({ ...previous, accent }))
            }}><option value="en-GB">Anh–Anh</option><option value="en-US">Anh–Mỹ</option></select>
          </div>
          {audioStatus && <small role="status">{audioStatus}</small>}
          <ArticulationLab key={sound.symbol} sound={sound} view={view} setView={setView} />
          <div className="ipa-study-tip"><strong>Lỗi hay gặp{tip?.vs ? ' · dễ nhầm ' + tip.vs : ''}</strong><p>{sound.mistake}</p></div>
          <VoiceMirror key={sound.symbol} />
          <button type="button" onClick={() => jumpTo('ipa-words')}>Sang luyện với từ ↓</button>
        </section>
        <IpaWordPractice key={sound.symbol} sound={sound} learnNext={() => nextSymbol && selectSound(nextSymbol, true)} nextSymbol={nextSymbol} />
      </div>
    </div>

    <section id="ear" className="panel stack" tabIndex={-1}>
      <div className="between">
        <h2>Luyện nghe phân biệt <span className="pill">{pairs.length} cặp âm</span></h2>
        <select aria-label="Cặp âm" value={pair} onChange={event => setPair(Number(event.target.value))}>
          {pairs.map((item, index) => <option key={item.words.join(':')} value={index}>/{item.sounds.join('/ – /')}/ · {item.words.join(' / ')}</option>)}
        </select>
        <button className="button" onClick={randomPair}>Cặp âm ngẫu nhiên</button>
      </div>
      {!earStarted && <><p className="muted">Nghe 20 từ và chọn đáp án. Câu sai được lưu để ôn lại.</p><button className="primary" onClick={() => {
        setEarStarted(true); setEarPosition(0); setEarScore(0); setRound(value => value + 1)
      }}>Bắt đầu 20 câu</button></>}
      {earStarted && earPosition < earTotal && <><span className="pill">{earPosition + 1}/{earTotal}</span><EarDrill key={pair + ':' + round} pair={pairs[pair]} qualifies={earPosition + 1 >= minimumWork(earTotal)} done={correct => {
        setEarScore(value => value + Number(correct))
        setEarPosition(value => value + 1)
        randomPair()
      }} /></>}
      {earStarted && earPosition === earTotal && <div role="status" className="stack"><p>Kết quả: <strong>{earScore}/{earTotal}</strong>.</p><button className="primary" onClick={() => setEarStarted(false)}>Luyện lại 20 câu</button></div>}
    </section>

    <IpaIllustratedGuide onSelectSound={symbol => selectSound(symbol, true)} />
    <AudioSandbox />
  </>
}
