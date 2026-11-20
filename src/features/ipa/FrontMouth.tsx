import { useId } from 'react'
import type { Articulation } from './articulation'

export function FrontMouth({ articulation, symbol }: { articulation: Articulation; symbol: string }) {
  const { pose } = articulation
  const prefix = useId()
  const id = (name: string) => prefix + name
  const url = (name: string) => `url(#${id(name)})`
  const cx = 168
  const spread = 40 + pose.spread * 12 - pose.round * 19
  const top = 154 - pose.round * 2
  const low = top + pose.opening * (39 + pose.round * 9)
  const left = cx - spread
  const right = cx + spread
  const hollowTop = top - pose.round * 5
  const inner = `M${left} ${top} C${left + 12} ${hollowTop - 3} 154 ${hollowTop - 6} ${cx} ${hollowTop - 5} C182 ${hollowTop - 6} ${right - 12} ${hollowTop - 3} ${right} ${top} C${right - 6} ${low + 4} 185 ${low + 3} ${cx} ${low + 4} C151 ${low + 3} ${left + 6} ${low + 4} ${left} ${top}Z`
  const jaw = pose.opening * 13

  return <svg className="ipa-front-svg" viewBox="0 0 336 248" role="img" aria-label={`Khẩu hình nhìn từ trước khi phát âm /${symbol}/`}>
    <defs>
      <radialGradient id={id('skin')} cx="46%" cy="38%" r="67%">
        <stop offset="0%" stopColor="#ffe1c7" /><stop offset="59%" stopColor="#efb299" /><stop offset="100%" stopColor="#b87567" />
      </radialGradient>
      <linearGradient id={id('lip')} x2="0" y2="1">
        <stop stopColor="#8f3a4b" /><stop offset="44%" stopColor="#c46878" /><stop offset="85%" stopColor="#df8894" /><stop offset="100%" stopColor="#a34d61" />
      </linearGradient>
      <radialGradient id={id('cheek')}>
        <stop stopColor="#d47573" stopOpacity=".42" /><stop offset="100%" stopColor="#d47573" stopOpacity="0" />
      </radialGradient>
      <clipPath id={id('inside')}><path d={inner} /></clipPath>
    </defs>
    <path d="M121 193C128 218 123 225 107 248H229C214 225 209 218 215 193Z" fill="#d39581" />
    <path d="M104 101C82 87 79 104 85 124C89 139 98 141 108 135M231 101C253 87 257 104 251 123C245 140 239 142 228 135" fill="#d79a82" stroke="#bb7f71" />
    <path d={`M95 87C93 37 121 16 168 16C215 16 243 38 241 87C241 131 239 ${160 + jaw / 2} 215 ${184 + jaw}C198 ${202 + jaw} 182 ${212 + jaw} 168 ${212 + jaw}C154 ${212 + jaw} 137 ${203 + jaw} 121 ${185 + jaw}C99 ${162 + jaw / 2} 94 132 95 87Z`}
      fill={url('skin')} stroke="#b98376" strokeWidth="1.5" />
    <path d="M94 94C84 60 96 23 124 10C163-8 216 6 233 38C243 57 246 74 241 96L231 79C231 49 208 41 198 26C186 43 152 48 111 55L101 88Z" fill="#49313a" />
    <path d="M112 81Q125 76 143 81M193 81Q211 75 224 81" fill="none" stroke="#714c4c" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M112 92Q126 85 142 91Q126 101 112 92ZM194 91Q210 85 224 92Q210 101 194 91Z" fill="#fff1e4" stroke="#a56b65" strokeWidth="1.2" />
    <circle cx="127" cy="92" r="4.5" fill="#513e3b" /><circle cx="209" cy="92" r="4.5" fill="#513e3b" />
    <ellipse cx="117" cy="132" rx="27" ry="20" fill={url('cheek')} /><ellipse cx="219" cy="132" rx="27" ry="20" fill={url('cheek')} />
    <path d="M161 94Q159 111 151 122Q147 131 157 131M176 94Q178 113 184 123Q189 131 179 131M156 132Q168 137 180 132" fill="none" stroke="#b87970" strokeWidth="2" strokeLinecap="round" />
    <path d="M155 128Q161 125 164 128M172 128Q177 125 181 128" fill="none" stroke="#925c55" strokeWidth="2.7" strokeLinecap="round" />
    <path d={`M${left - 2} ${top} C${left + 15} ${top - 8} 153 ${top - 17 - pose.round * 4} 168 ${top - 11 - pose.round * 3} C183 ${top - 17 - pose.round * 4} ${right - 15} ${top - 8} ${right + 2} ${top} C${right - 12} ${low + 10} 190 ${low + 15} 168 ${low + 13} C146 ${low + 15} ${left + 12} ${low + 10} ${left - 2} ${top}Z`} fill={url('lip')} stroke="#a75462" strokeWidth=".8" />
    {pose.opening > .018 && <g clipPath={url('inside')}>
      <path d={inner} fill="#492431" />
      <path d={`M${left} ${top - 9} H${right} V${top + 2 + pose.lipBite * 6} Q168 ${top + 7 + pose.lipBite * 7} ${left} ${top + 2}Z`} fill="#fff5e9" />
      <path d={`M168 ${top - 6}V${top + 11}M158 ${top - 6}V${top + 9}M178 ${top - 6}V${top + 9}`} stroke="#cfb4ad" strokeWidth=".65" opacity=".8" />
      <ellipse cx="168" cy={low + 3 - pose.tongueVisible * 6} rx={19 + pose.tongueVisible * 6} ry={5 + pose.tongueVisible * 2} fill="#dc8592" />
    </g>}
    {pose.opening <= .018 && <path d={`M${left} ${top}Q168 ${top + 5} ${right} ${top}`} stroke="#7e3549" strokeWidth="2" fill="none" strokeLinecap="round" />}
    {pose.tongueVisible > .03 && <path d={`M151 ${top + 5}Q168 ${top + 1} 185 ${top + 5}Q180 ${low + 8} 168 ${low + 8}Q156 ${low + 8} 151 ${top + 5}Z`}
      fill="#e38d98" stroke="#ad5967" opacity={pose.tongueVisible} />}
    <path d={`M151 ${low + 8}Q168 ${low + 11} 185 ${low + 8}`} fill="none" stroke="#eea5ad" strokeWidth="1.3" strokeLinecap="round" opacity=".75" />
  </svg>
}
