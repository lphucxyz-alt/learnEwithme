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
  const jawShift = vowel ? Math.max(1, opening - 1) * 2 : sound.symbol === 'p' || sound.symbol === 'b' ? 0 : 2
  const tonguePath = `M258 186 Q222 177 194 171 Q${focusX + 33} ${tongueY + 17} ${focusX} ${tongueY} Q91 143 77 151 Q75 162 91 ${177 + jawOpen * 3} Q160 ${198 + jawOpen * 4} 258 191Z`
  const airPath = nasal ? 'M280 194Q294 174 284 154Q298 131 286 110Q310 91 335 85' : 'M280 194Q295 174 281 154Q219 130 162 137Q108 137 77 142'
  const mirroredAction = vowel
    ? `Giữ mắt ở hàm dưới: âm này mở hàm ${opening >= 4 ? 'rộng' : opening >= 3 ? 'vừa' : 'hẹp'}; lưỡi đặt ở ${focusLabel.toLowerCase()}.`
    : lipRound
      ? `Chu môi nhẹ, đưa lưỡi tới ${focusLabel.toLowerCase()}, rồi kiểm tra rung cổ bằng đầu ngón tay.`
      : `Giữ môi thả lỏng, đưa lưỡi tới ${focusLabel.toLowerCase()}; chạm tay lên cổ để kiểm tra rung.`

  return (
    <div className="mouth">
      <svg
        viewBox="0 0 440 270"
        role="img"
        aria-label={`Khuôn mặt nhìn ngang và mặt cắt khoang miệng khi phát âm /${sound.symbol}/. ${focusLabel}. ${sound.voiced ? 'Dây thanh rung.' : 'Dây thanh không rung.'} ${nasal ? 'Hơi thoát qua mũi.' : 'Hơi thoát qua miệng.'}`}
        className="mouth-svg"
      >
        <defs>
          <marker id={marker} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0L9 4.5L0 9Z" fill={nasal ? '#4776d0' : '#db456f'} />
          </marker>
        </defs>

        <text x="316" y="31" className="mouth-orientation">MẶT NHÌN NGANG · MŨI ←</text>
        <path d="M143 31C224 17 301 49 333 102C348 127 345 157 331 187C318 215 290 237 249 245H171C149 232 132 211 117 190C104 175 85 170 58 162C47 159 38 155 34 150C48 146 65 140 75 132C82 125 82 116 68 112C61 110 57 106 63 101L82 92C85 65 106 42 143 31Z" className="mouth-head" />
        <path d="M86 111C98 83 123 63 156 56C175 52 194 54 211 62" className="mouth-face-line" />
        <path d="M101 88Q119 77 137 87" className="mouth-brow" />
        <ellipse cx="121" cy="96" rx="9" ry="5.5" className="mouth-eye" />
        <circle cx="120" cy="96" r="2.5" className="mouth-pupil" />
        <path d="M65 107Q57 110 59 114Q63 118 71 114" className="mouth-nostril" />
        <path d="M84 112C112 87 145 73 183 73C223 72 263 83 294 104L315 116Q295 120 277 112C229 95 182 93 141 108C119 116 101 129 89 142Z" className="mouth-nose" />
        <path d="M85 135Q116 119 149 111C197 100 243 105 278 119L291 136L278 157Q219 172 166 171L112 166Q92 159 85 145Z" className="mouth-cavity" />

        <path d="M93 124Q119 108 151 101Q218 84 277 106" className="mouth-hard-palate" />
        <path d={nasal ? 'M277 106Q294 118 286 139' : 'M277 106Q291 103 300 114'} className={`mouth-velum${nasal ? ' is-open' : ''}`} />

        <path d="M87 133L103 129L111 145L96 151Z" className="mouth-tooth" />
        <g className="mouth-lower-jaw" style={{ transform: `translateY(${jawShift}px)` }}>
          <path d="M88 163Q123 197 184 207Q225 214 269 203" className="mouth-jawline" />
          <path d="M87 153L103 151L111 166L96 169Z" className="mouth-tooth" />
          <path d={lipRound ? 'M74 151Q53 154 50 143' : 'M74 151L53 145'} className="mouth-lower-lip" />
        </g>
        <path d={tonguePath} className="mouth-tongue" />

        <path d={lipRound ? 'M75 132Q54 125 50 139' : 'M75 135L51 140'} className="mouth-lips" />
        <path d="M276 194Q286 202 278 214M281 194Q291 202 283 214" className={`mouth-vocal-cords${sound.voiced ? ' is-voiced' : ''}`} />

        {!blocked && (
          <>
            <path d={airPath} className={`mouth-air${nasal ? ' is-nasal' : ''}`} markerEnd={`url(#${marker})`} />
            <circle r="3.5" className={`mouth-air-dot${nasal ? ' is-nasal' : ''}`}>
              <animateMotion dur={nasal ? '1.5s' : '1.2s'} repeatCount="indefinite" path={airPath} />
            </circle>
            <circle r="2.5" className={`mouth-air-dot${nasal ? ' is-nasal' : ''}`}>
              <animateMotion dur={nasal ? '1.5s' : '1.2s'} begin="-.4s" repeatCount="indefinite" path={airPath} />
            </circle>
          </>
        )}
        {['p', 't', 'k'].includes(sound.symbol) && <path d="M56 142L39 140M56 147L39 148" className="mouth-release" />}

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

      <p className="mouth-mirror-tip"><strong>Thử ngay trước gương.</strong> {mirroredAction} Đặt ngón tay lên cổ: hữu thanh sẽ có rung; vô thanh thì không.</p>

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
