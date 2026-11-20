import { useId } from 'react'
import { placeLabels, type Articulation } from './articulation'

const markers = {
  lips: [72, 146], 'lip-teeth': [88, 151], teeth: [91, 141], ridge: [114, 124], postalveolar: [136, 122],
  palate: [164, 109], velum: [233, 112], glottis: [269, 211]
} as const

export function Mouth({ articulation, symbol, playing }: { articulation: Articulation; symbol: string; playing: boolean }) {
  const marker = useId()
  const { pose, flow, voiced, place } = articulation
  const narrow = pose.opening <= .035
  const nasal = flow === 'nose'
  const airColor = nasal ? '#276d93' : '#ad365a'
  const oralEnd = flow === 'blocked' ? 'M269 218Q277 170 249 141Q234 131 216 138' : 'M269 218Q276 178 249 143Q224 126 192 136Q138 130 104 146Q69 147 49 148'
  const airPath = nasal ? 'M269 218Q276 162 250 134Q251 100 207 90Q149 78 105 102Q90 110 68 114' : oralEnd
  const jaw = pose.opening * 19
  const tongue = `M${pose.tipX} ${pose.tipY} C${pose.tipX + 20} ${pose.tipY + 1} 132 ${pose.blade - 4} 157 ${pose.blade} C185 ${pose.blade + 6} 211 ${pose.back - 6} 230 ${pose.back} Q254 ${pose.back + 5} 263 188 Q255 203 236 206 Q178 ${205 + jaw} 126 ${182 + jaw} Q${pose.tipX - 9} ${pose.tipY + 15} ${pose.tipX} ${pose.tipY}Z`
  const point = place === 'front' ? [146, pose.blade] : place === 'central' ? [179, (pose.blade + pose.back) / 2]
    : place === 'back' ? [231, pose.back] : markers[place]

  return <svg className="ipa-side-svg" viewBox="0 0 336 248" role="img"
    aria-label={`Mặt cắt dọc của âm /${symbol}/. Vị trí cấu âm: ${placeLabels[place]}.`}>
    <defs>
      <marker id={marker} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0 0L8 4L0 8Z" fill={airColor} />
      </marker>
    </defs>
    <path d="M113 28C168 9 255 27 287 63C315 94 310 132 299 166C289 197 282 219 283 248H226C226 226 216 219 195 216C157 217 123 200 105 174Q93 157 75 151L83 140L75 132Q84 125 83 118L63 117Q51 117 57 109L77 84Q83 48 113 28Z"
      fill="#edbc9f" stroke="#9e7268" strokeWidth="1.6" />
    <path d="M85 100C110 78 151 67 196 73C222 76 245 84 256 104Q233 102 211 94C170 85 125 92 98 113L82 116Z"
      fill="#dbeaf0" stroke="#a6bcc9" strokeWidth="1.5" />
    <path d={`M87 137Q119 107 159 102Q202 96 230 106C270 116 288 141 283 169L280 242H257L259 218Q259 202 244 194Q173 ${193 + jaw} 110 ${172 + jaw}L85 ${152 + jaw / 2}Z`}
      fill="#623449" stroke="#9e655f" strokeWidth="1.5" />
    <path d="M97 130Q119 111 151 103Q195 93 225 107" fill="none" stroke="#e7ad86" strokeWidth="9" strokeLinecap="round" />
    <path d={nasal ? 'M224 106Q241 116 236 137' : 'M224 106Q245 105 254 116'} fill="none" stroke="#e7a581" strokeWidth="8" strokeLinecap="round" />
    <path d={`M92 ${157 + jaw / 2}Q113 ${182 + jaw} 157 ${196 + jaw}Q211 ${213 + jaw / 4} 249 197`}
      fill="none" stroke="#d09577" strokeWidth="6" strokeLinecap="round" />
    <path d={tongue} fill="#d77989" stroke="#a84f63" strokeWidth="1.5" />
    <path d="M84 134L98 129L105 140L93 146Z" fill="#fff5e9" stroke="#b79487" />
    <path d={`M87 ${150 + jaw / 2}L100 ${149 + jaw / 2}L104 ${159 + jaw / 2}L91 ${161 + jaw / 2}Z`} fill="#fff5e9" stroke="#b79487" />
    <path d={`M83 139Q${72 - 8 * pose.round} ${133 - 2 * pose.round} ${67 - 8 * pose.round} 145`}
      fill="none" stroke="#a24b63" strokeWidth="6" strokeLinecap="round" />
    <path d={`M83 ${149 + jaw / 2}Q${73 - 8 * pose.round} ${154 + jaw / 2} ${67 - 8 * pose.round} ${narrow ? 145 : 150 + jaw / 2 - pose.lipBite * 5}`}
      fill="none" stroke="#b55a71" strokeWidth="6" strokeLinecap="round" />
    <path d="M97 63Q111 58 127 64M99 71Q112 67 123 71M65 111Q71 107 76 111" fill="none" stroke="#89635f" strokeWidth="2" strokeLinecap="round" />
    <path d="M260 210l11 4m-11 4 11 4" className="ipa-vocal-folds" data-voiced={voiced} data-moving={playing} />
    {flow === 'sides' && <path d="M98 147Q83 141 59 140M98 151Q83 155 59 155"
      className="ipa-air-path" stroke={airColor} markerEnd={`url(#${marker})`} data-moving={playing} />}
    {flow !== 'none' && flow !== 'sides' && <path
      d={airPath} className="ipa-air-path" stroke={airColor} markerEnd={flow === 'blocked' ? undefined : `url(#${marker})`}
      data-moving={playing && flow !== 'blocked'} />}
    {flow === 'blocked' && <path d="M209 131l-6 13" stroke="#ffcad1" strokeWidth="3" strokeLinecap="round" />}
    <circle cx={point[0]} cy={point[1]} r="7.5" fill="#fae1e7" stroke="#9e2754" strokeWidth="2" />
    <circle cx={point[0]} cy={point[1]} r="2.7" fill="#9e2754" />
    <g className="ipa-anatomy-labels" aria-hidden="true">
      <path d="M35 136L68 142" /><text x="12" y="133">Môi</text>
      <path d="M132 82L149 98" /><text x="115" y="77">Ngạc cứng</text>
      <path d="M276 78L234 102" /><text x="302" y="73" textAnchor="end">Ngạc mềm</text>
      <path d="M115 210L144 181" /><text x="88" y="219">Lưỡi</text>
      <path d="M277 229L269 222" /><text x="332" y="239" textAnchor="end">Dây thanh</text>
    </g>
  </svg>
}
