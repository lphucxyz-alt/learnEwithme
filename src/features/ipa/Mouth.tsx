import { useId, useState } from 'react'
import type { Sound } from '../../data/ipa'

const places: Record<string, [number, number]> = {
  front: [233, 107], central: [200, 110], back: [157, 116], lips: [308, 116],
  'lip-teeth': [292, 116], teeth: [279, 103], ridge: [260, 90], postalveolar: [238, 77],
  palate: [204, 69], velum: [153, 82], glottis: [131, 185]
}

const placeLabels: Record<string, string> = {
  lips: 'Hai môi',
  'lip-teeth': 'Răng & môi',
  teeth: 'Răng',
  ridge: 'Lợi trên',
  postalveolar: 'Sau lợi',
  palate: 'Ngạc cứng',
  velum: 'Ngạc mềm',
  glottis: 'Thanh môn',
  front: 'Khoang trước',
  central: 'Khoang giữa',
  back: 'Khoang sau'
}

export function Mouth({ sound }: { sound: Sound }) {
  const [endingFor, setEndingFor] = useState('')
  const ending = endingFor === sound.symbol
  const marker = useId()
  const glowId = useId()
  const [place, opening, round] = ending && sound.end ? sound.end : sound.shape
  const [x, y] = places[place] ?? [200, 110]
  const nasal = sound.manner === 'nasal'
  const closed = ['stop', 'nasal', 'affricate'].includes(sound.manner)
  const vowel = sound.manner === 'vowel'
  const jaw = (vowel ? opening : 2) * 5
  const tongueX = Math.min(270, Math.max(148, x))
  const tongueY = vowel ? 83 + opening * 11 : y + (closed ? 1 : 10)
  const tight = place === 'lips' && closed

  return (
    <div className="mouth">
      <svg
        viewBox="0 0 350 230"
        role="img"
        aria-label={'Sơ đồ cấu âm /' + sound.symbol + '/'}
        className="mouth-svg"
      >
        <defs>
          <marker id={marker} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0L8 4L0 8Z" fill="#34d399" />
          </marker>

          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="tongueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--panel)" />
            <stop offset="100%" stopColor="var(--inset)" />
          </linearGradient>
        </defs>

        {/* Khuôn mặt & Vỏ đầu */}
        <path
          d="M86 9Q202 0 267 40L314 66Q319 73 304 78L298 98Q319 105 315 118L310 129Q316 140 303 158Q293 202 230 218H120Q110 196 112 158L118 108Q95 74 86 9Z"
          fill="url(#headGradient)"
          stroke="var(--line-strong)"
          strokeWidth="1.5"
        />

        {/* Khoang mũi (Nasal cavity) */}
        <path
          d="M137 69Q182 36 240 46L286 68Q276 81 242 71Q187 50 147 86L141 175H123L125 105Z"
          fill="var(--inset)"
          stroke="var(--line)"
          strokeWidth="1"
        />

        {/* Khoang miệng (Oral cavity) */}
        <path
          d="M143 100Q220 39 283 101L300 115L298 144Q252 179 162 160L138 183L126 176Z"
          fill="rgba(15, 23, 42, 0.45)"
          stroke="var(--line)"
          strokeWidth="1"
        />

        {/* Răng trên & Răng dưới */}
        <path d="M277 96L289 100L284 114L273 109Z" fill="#ffffff" stroke="var(--line-strong)" strokeWidth="0.8" />
        <path
          d={`M272 ${112 + jaw}L284 ${111 + jaw}L289 ${120 + jaw}L275 ${124 + jaw}Z`}
          fill="#ffffff"
          stroke="var(--line-strong)"
          strokeWidth="0.8"
        />

        {/* Ngạc mềm (Velum) - nâng lên hoặc hạ xuống để mở mũi */}
        <path
          d={nasal ? 'M169 77Q151 98 149 111' : 'M171 77Q151 77 134 91'}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Lưỡi (Tongue anatomy) */}
        <path
          className="anatomy"
          d={`M139 174Q146 153 158 141Q${tongueX - 24} ${tongueY} ${tongueX} ${tongueY}Q${Math.min(
            286,
            tongueX + 20
          )} ${117 + jaw} 276 ${129 + jaw}Q${209} ${156 + jaw} 161 160L145 184Z`}
          fill="url(#tongueGradient)"
          stroke="#e11d48"
          strokeWidth="1.2"
        />

        {/* Môi trên & Môi dưới */}
        <path
          d={`M292 106Q${318 + round * 2} 103 ${308 + round * 2} 115M292 ${
            tight ? 115 : 120 + jaw
          }Q${319 + round * 2} ${tight ? 115 : 127 + jaw} ${307 + round * 2} ${
            tight ? 114 : 118 + jaw
          }`}
          fill="none"
          stroke="#fb7185"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Luồng hơi (Airflow) */}
        {(!closed || nasal) && (
          <path
            className="air"
            d={
              nasal
                ? 'M133 177Q130 115 150 79Q191 43 285 67'
                : 'M134 175Q140 111 173 101Q225 74 294 114'
            }
            markerEnd={'url(#' + marker + ')'}
          />
        )}

        {/* Điểm cấu âm chính (Focus ring & dot) */}
        <circle cx={x} cy={y} r="14" fill={`url(#${glowId})`} className="anatomy" opacity="0.6" />
        <circle
          className="anatomy"
          cx={x}
          cy={y}
          r="6"
          fill="#818cf8"
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Dây thanh âm (Vocal cords) */}
        <g className={sound.voiced ? 'vocal' : ''}>
          <path d="M121 186l18 -3" stroke={sound.voiced ? '#34d399' : 'var(--muted)'} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M122 195l17 -3" stroke={sound.voiced ? '#34d399' : 'var(--muted)'} strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Chú thích giải phẫu nhỏ tinh tế */}
        <text x="14" y="24" fill="var(--muted)" fontSize="11" fontWeight="600" letterSpacing="0.04em">
          VỊ TRÍ: {placeLabels[place] ?? place.toUpperCase()}
        </text>
        <text x="14" y="40" fill={sound.voiced ? '#34d399' : 'var(--muted)'} fontSize="11" fontWeight="500">
          {sound.voiced ? '● Dây thanh rung' : '○ Không rung'}
        </text>
        <text x="14" y="56" fill={nasal ? '#38bdf8' : '#cbd5e1'} fontSize="11" fontWeight="500">
          {nasal ? '↗ Luồng hơi qua mũi' : '→ Luồng hơi qua miệng'}
        </text>
      </svg>

      <div className="row">
        <span className="pill">{nasal ? 'Hơi qua mũi' : closed ? 'Chặn và nhả hơi' : 'Hơi qua miệng'}</span>
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
