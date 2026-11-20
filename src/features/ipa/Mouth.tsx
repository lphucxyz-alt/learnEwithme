import { useId, useState } from 'react'
import type { Sound } from '../../data/ipa'

const tonguePositions: Record<string, [number, number, string]> = {
  front: [112, 151, 'Đầu và mặt lưỡi phía trước'],
  central: [170, 146, 'Thân lưỡi ở giữa'],
  back: [226, 155, 'Cuống lưỡi phía sau'],
  lips: [74, 153, 'Hai môi'],
  'lip-teeth': [86, 151, 'Răng trên và môi dưới'],
  teeth: [96, 148, 'Đầu lưỡi gần răng'],
  ridge: [111, 137, 'Đầu lưỡi chạm lợi trên'],
  postalveolar: [132, 128, 'Phiến lưỡi sau lợi'],
  palate: [178, 119, 'Thân lưỡi gần ngạc cứng'],
  velum: [232, 137, 'Cuống lưỡi chạm ngạc mềm'],
  glottis: [286, 206, 'Hơi đi qua thanh môn'],
}

const places: Record<string, string> = {
  lips: 'Hai môi',
  'lip-teeth': 'Răng trên và môi dưới',
  teeth: 'Răng',
  ridge: 'Lợi trên',
  postalveolar: 'Sau lợi',
  palate: 'Ngạc cứng',
  velum: 'Ngạc mềm',
  glottis: 'Thanh môn',
  front: 'Phần trước lưỡi',
  central: 'Thân lưỡi',
  back: 'Cuống lưỡi',
}

export function Mouth({ sound }: { sound: Sound }) {
  const [endingFor, setEndingFor] = useState('')
  const ending = endingFor === sound.symbol
  const marker = useId()
  const [place, opening, round] = ending && sound.end ? sound.end : sound.shape
  const [focusX, focusY, focusLabel] = tonguePositions[place] ?? tonguePositions.central
  const nasal = sound.manner === 'nasal'
  const blocked = ['stop', 'affricate'].includes(sound.manner)
  const vowel = sound.manner === 'vowel'
  const jawOpen = vowel ? opening : sound.symbol === 'p' || sound.symbol === 'b' ? 0 : 1
  const lipRound = vowel ? round > 1 : /^(w|ʃ|ʒ|tʃ|dʒ)$/.test(sound.symbol)
  const tongueY = vowel ? 163 - (5 - opening) * 5 : 157
  const tonguePath = `M258 186 Q222 177 194 171 Q${focusX + 33} ${tongueY + 17} ${focusX} ${tongueY} Q91 143 77 151 Q75 162 91 ${177 + jawOpen * 3} Q160 ${198 + jawOpen * 4} 258 191Z`

  return (
    <div className="mouth">
      <svg
        viewBox="0 0 440 270"
        role="img"
        aria-label={`Mặt cắt khoang miệng khi phát âm /${sound.symbol}/. ${focusLabel}. ${sound.voiced ? 'Dây thanh rung.' : 'Dây thanh không rung.'} ${nasal ? 'Hơi thoát qua mũi.' : 'Hơi thoát qua miệng.'}`}
        className="mouth-svg"
      >
        <defs>
          <marker id={marker} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0L9 4.5L0 9Z" fill={nasal ? '#4776d0' : '#db456f'} />
          </marker>
        </defs>

        <path d="M113 39Q196 24 267 45Q322 63 348 113L340 175Q325 220 270 238H157Q127 219 108 193L87 174L54 160L35 149L59 140L73 126L83 95Q89 60 113 39Z" className="mouth-head" />
        <path d="M84 116Q118 80 174 73Q235 66 291 87L324 104Q305 113 284 105Q225 83 176 94Q126 104 100 133Z" className="mouth-nose" />
        <path d="M87 130Q112 117 143 111Q212 95 278 115L291 128L280 150Q217 166 166 169L113 166Q92 157 87 145Z" className="mouth-cavity" />

        <path d="M93 124Q119 108 151 101Q218 84 277 106" className="mouth-hard-palate" />
        <path d={nasal ? 'M277 106Q294 118 286 139' : 'M277 106Q291 103 300 114'} className={`mouth-velum${nasal ? ' is-open' : ''}`} />

        <path d="M88 130L105 128L111 146L97 150Z" className="mouth-tooth" />
        <path d={`M88 ${151 + jawOpen * 4}L104 ${151 + jawOpen * 4}L111 ${165 + jawOpen * 4}L96 ${164 + jawOpen * 4}Z`} className="mouth-tooth" />
        <path d={tonguePath} className="mouth-tongue" />

        <path d={lipRound ? 'M73 130Q53 126 50 139M73 148Q52 152 50 143' : 'M73 132L54 137M73 147L54 143'} className="mouth-lips" />
        <path d="M276 194Q286 202 278 214M281 194Q291 202 283 214" className={`mouth-vocal-cords${sound.voiced ? ' is-voiced' : ''}`} />

        {!blocked && (
          <path
            d={nasal ? 'M278 157Q295 143 301 121Q310 99 333 91' : 'M238 177Q187 169 143 158Q108 151 77 142'}
            className={`mouth-air${nasal ? ' is-nasal' : ''}`}
            markerEnd={`url(#${marker})`}
          />
        )}

        <circle cx={focusX} cy={focusY} r="15" className="mouth-focus-halo" />
        <circle cx={focusX} cy={focusY} r="7" className="mouth-focus" />

        <g className="mouth-callouts" aria-hidden="true">
          <path d="M58 119L74 136" /><text x="12" y="115">Môi</text>
          <path d="M111 116L101 130" /><text x="105" y="111">Răng</text>
          <path d="M166 77L177 99" /><text x="130" y="67">Ngạc cứng</text>
          <path d="M319 101L289 112" /><text x="320" y="98">Ngạc mềm</text>
          <path d="M159 213L171 183" /><text x="137" y="229">Lưỡi</text>
          <path d="M311 218L286 207" /><text x="312" y="225">Dây thanh</text>
        </g>
        <text x="18" y="252" className="mouth-flow-label">{nasal ? 'HƠI QUA MŨI' : blocked ? 'CHẶN HƠI RỒI NHẢ' : 'HƠI QUA MIỆNG'}</text>
        <text x="324" y="252" className="mouth-place-label">{places[place] ?? focusLabel}</text>
      </svg>

      <div className="mouth-legend" aria-label="Chú giải sơ đồ">
        <span><i className="legend-lips" /> Môi và răng</span>
        <span><i className="legend-palate" /> Vòm miệng</span>
        <span><i className="legend-tongue" /> Lưỡi và vị trí đặt lưỡi</span>
        <span><i className={nasal ? 'legend-air-nasal' : 'legend-air'} /> {nasal ? 'Luồng hơi qua mũi' : 'Luồng hơi qua miệng'}</span>
        <span><i className={sound.voiced ? 'legend-voice-on' : 'legend-voice-off'} /> Dây thanh {sound.voiced ? 'đang rung' : 'không rung'}</span>
      </div>

      <div className="row">
        <span className="pill">{nasal ? 'Hơi qua mũi' : blocked ? 'Chặn và nhả hơi' : 'Hơi qua miệng'}</span>
        <span className="pill">{sound.voiced ? 'Dây thanh rung (Hữu thanh)' : 'Dây thanh không rung (Vô thanh)'}</span>
        {sound.end && (
          <button className="button" type="button" onClick={() => setEndingFor(ending ? '' : sound.symbol)}>
            {ending ? 'Xem đầu âm' : 'Xem cuối âm'}
          </button>
        )}
      </div>
    </div>
  )
}
