import type { Sound } from '../../data/ipa'

type Pose = {
  opening: number
  round: number
  spread: number
  tipX: number
  tipY: number
  blade: number
  back: number
  lipBite: number
  tongueVisible: number
}
type Airflow = 'none' | 'nose' | 'blocked' | 'mouth' | 'sides'

const neutral: Pose = { opening: .23, round: 0, spread: 0, tipX: 103, tipY: 170, blade: 158, back: 155, lipBite: 0, tongueVisible: 0 }
const consonantPose: Partial<Record<string, Partial<Pose>>> = {
  p: { opening: 0 }, b: { opening: 0 }, m: { opening: 0 },
  f: { opening: .14, lipBite: 1 }, v: { opening: .14, lipBite: 1 },
  θ: { opening: .19, tipX: 80, tipY: 146, tongueVisible: 1 },
  ð: { opening: .19, tipX: 80, tipY: 146, tongueVisible: 1 },
  t: { opening: .21, tipX: 115, tipY: 128, blade: 152 },
  d: { opening: .21, tipX: 115, tipY: 128, blade: 152 },
  n: { opening: .23, tipX: 115, tipY: 128, blade: 151 },
  l: { opening: .25, tipX: 115, tipY: 128, blade: 153 },
  s: { opening: .12, spread: .45, tipX: 112, tipY: 143, blade: 141 },
  z: { opening: .12, spread: .45, tipX: 112, tipY: 143, blade: 141 },
  ʃ: { opening: .25, round: .55, tipX: 115, tipY: 149, blade: 132 },
  ʒ: { opening: .25, round: .55, tipX: 115, tipY: 149, blade: 132 },
  tʃ: { opening: .19, round: .6, tipX: 118, tipY: 136, blade: 121 },
  dʒ: { opening: .19, round: .6, tipX: 118, tipY: 136, blade: 121 },
  k: { opening: .25, back: 116 }, ɡ: { opening: .25, back: 116 }, ŋ: { opening: .25, back: 116 },
  r: { opening: .23, round: .23, tipX: 127, tipY: 145, blade: 143 },
  j: { opening: .18, spread: .5, blade: 123, back: 142 },
  w: { opening: .13, round: .95, back: 133 },
  h: { opening: .35 }
}

function vowelPose([place, opening, rounding]: Sound['shape']): Pose {
  const gap = [0, .16, .27, .46, .74, .96][opening] ?? .45
  return {
    ...neutral,
    opening: gap,
    round: rounding / 3,
    spread: place === 'front' ? Math.max(0, (4 - opening) / 3) : 0,
    tipY: 157 + gap * 27,
    blade: (place === 'front' ? 116 : place === 'central' ? 127 : 146) + gap * 44,
    back: (place === 'back' ? 123 : 143) + gap * 34
  }
}

function mix(from: Pose, to: Pose, progress: number): Pose {
  const fraction = Math.min(1, Math.max(0, progress))
  const eased = fraction * fraction * (3 - 2 * fraction)
  const lerp = (a: number, b: number) => Number((a + (b - a) * eased).toFixed(2))
  return {
    opening: lerp(from.opening, to.opening),
    round: lerp(from.round, to.round),
    spread: lerp(from.spread, to.spread),
    tipX: lerp(from.tipX, to.tipX),
    tipY: lerp(from.tipY, to.tipY),
    blade: lerp(from.blade, to.blade),
    back: lerp(from.back, to.back),
    lipBite: lerp(from.lipBite, to.lipBite),
    tongueVisible: lerp(from.tongueVisible, to.tongueVisible)
  }
}

export const initialFrame = 36

export const placeLabels: Record<Sound['shape'][0], string> = {
  front: 'Phần trước lưỡi', central: 'Giữa lưỡi', back: 'Lưng lưỡi',
  lips: 'Hai môi', 'lip-teeth': 'Răng trên và môi dưới', teeth: 'Đầu lưỡi ở răng',
  ridge: 'Lợi trên', postalveolar: 'Sau lợi', palate: 'Ngạc cứng',
  velum: 'Ngạc mềm', glottis: 'Thanh môn'
}

export function getArticulation(sound: Sound, frame: number) {
  const start = sound.manner === 'vowel' ? vowelPose(sound.shape) : { ...neutral, ...consonantPose[sound.symbol] }
  const blocked = sound.manner === 'stop' || sound.manner === 'affricate'
  const release = sound.manner === 'affricate' ? { ...start, opening: .29, tipY: 149, blade: 133 } : neutral
  const nasal = sound.manner === 'nasal'
  const active = frame >= 24 && frame < 94
  const place = sound.end && frame >= 63 ? sound.end[0] : sound.shape[0]
  let pose = start
  let phase = 'Giữ khẩu hình'
  if (frame < 24) {
    pose = mix(neutral, start, frame / 24)
    phase = 'Chuẩn bị'
  } else if (sound.end) {
    pose = mix(start, vowelPose(sound.end), (frame - 38) / 47)
    phase = frame < 38 ? 'Đầu âm' : frame < 85 ? 'Lướt sang âm cuối' : 'Cuối âm'
  } else if (blocked) {
    pose = mix(start, release, (frame - 56) / 20)
    if (frame > 86) pose = mix(release, neutral, (frame - 86) / 14)
    phase = frame < 56 ? 'Chặn hơi' : 'Nhả hơi'
  } else if (frame > 84) {
    pose = mix(start, neutral, (frame - 84) / 16)
    phase = 'Thả lỏng'
  }
  const flow: Airflow = !active ? 'none' : nasal ? 'nose' : blocked && frame < 56 ? 'blocked' : sound.manner === 'lateral' ? 'sides' : 'mouth'
  return { pose, place, phase, flow, voiced: active && sound.voiced }
}

export type Articulation = ReturnType<typeof getArticulation>
