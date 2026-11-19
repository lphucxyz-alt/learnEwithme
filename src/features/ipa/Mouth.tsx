import { useId, useState } from 'react'
import type { Sound } from '../../data/ipa'

const places = {
  front: [233, 107], central: [200, 110], back: [157, 116], lips: [308, 116],
  'lip-teeth': [292, 116], teeth: [279, 103], ridge: [260, 90], postalveolar: [238, 77],
  palate: [204, 69], velum: [153, 82], glottis: [131, 185]
}

export function Mouth({ sound }: { sound: Sound }) {
  const [endingFor, setEndingFor] = useState('')
  const ending = endingFor === sound.symbol
  const marker = useId()
  const [place, opening, round] = ending && sound.end ? sound.end : sound.shape
  const [x, y] = places[place]
  const nasal = sound.manner === 'nasal'
  const closed = ['stop', 'nasal', 'affricate'].includes(sound.manner)
  const vowel = sound.manner === 'vowel'
  const jaw = (vowel ? opening : 2) * 5
  const tongueX = Math.min(270, Math.max(148, x))
  const tongueY = vowel ? 83 + opening * 11 : y + (closed ? 1 : 10)
  const tight = place === 'lips' && closed
  return <div className="mouth">
    <svg viewBox="0 0 350 226" role="img" aria-label={'Sơ đồ cấu âm /' + sound.symbol + '/'} className="mouth-svg">
      <defs><marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#148278" /></marker></defs>
      <path d="M86 9Q202 0 267 40L314 66Q319 73 304 78L298 98Q319 105 315 118L310 129Q316 140 303 158Q293 202 230 218H120Q110 196 112 158L118 108Q95 74 86 9Z" fill="#edc8a8" />
      <path d="M137 69Q182 36 240 46L286 68Q276 81 242 71Q187 50 147 86L141 175H123L125 105Z" fill="#824c5c" />
      <path d="M143 100Q220 39 283 101L300 115L298 144Q252 179 162 160L138 183L126 176Z" fill="#573746" />
      <path d="M277 96L289 100L284 114L273 109Z" fill="#fff8e4" />
      <path d={`M272 ${112+jaw}L284 ${111+jaw}L289 ${120+jaw}L275 ${124+jaw}Z`} fill="#fff8e4" />
      <path d={nasal ? 'M169 77Q151 98 149 111' : 'M171 77Q151 77 134 91'} fill="none" stroke="#e69898" strokeWidth="9" strokeLinecap="round" />
      <path className="anatomy" d={`M139 174Q146 153 158 141Q${tongueX-24} ${tongueY} ${tongueX} ${tongueY}Q${Math.min(286,tongueX+20)} ${117+jaw} 276 ${129+jaw}Q209 ${156+jaw} 161 160L145 184Z`} fill="#d36376" />
      <path d={`M292 106Q${318+round*2} 103 ${308+round*2} 115M292 ${tight ? 115 : 120+jaw}Q${319+round*2} ${tight ? 115 : 127+jaw} ${307+round*2} ${tight ? 114 : 118+jaw}`} fill="none" stroke="#a94359" strokeWidth="7" strokeLinecap="round" />
      {(!closed || nasal) && <path className="air" d={nasal ? 'M133 177Q130 115 150 79Q191 43 285 67' : 'M134 175Q140 111 173 101Q225 74 294 114'} markerEnd={'url(#' + marker + ')'} />}
      <circle className="anatomy" cx={x} cy={y} r={8} fill="#ffd777" stroke="#623a43" strokeWidth="2" />
      <path className={sound.voiced ? 'vocal' : ''} d="M121 186l18 -3m-17 10l17 -3" stroke="#f4ae87" strokeWidth="4" />
    </svg>
    <div className="row"><span className="pill">{nasal ? 'Hơi qua mũi' : closed ? 'Chặn và nhả hơi' : 'Hơi qua miệng'}</span>
      <span className="pill">{sound.voiced ? 'Dây thanh rung' : 'Dây thanh không rung'}</span>
      {sound.end && <button onClick={() => setEndingFor(ending ? '' : sound.symbol)}>{ending ? 'Xem đầu âm' : 'Xem cuối âm'}</button>}
    </div>
  </div>
}
