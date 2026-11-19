import { coachFeedbackSchema, type CoachRequest } from '../types/coach'

const localOrigin = 'http://127.0.0.1:4174'
export const localCoachUrl = localOrigin + import.meta.env.BASE_URL
const endpoint = localOrigin + '/api/coach'

async function wavFor(blob: Blob) {
  const decoder = new AudioContext()
  try {
    const source = await decoder.decodeAudioData(await blob.arrayBuffer())
    if (source.duration > 300) throw new Error('Hãy chọn bản ghi tối đa 5 phút.')
    const sampleRate = 16000
    const output = new OfflineAudioContext(1, Math.ceil(source.duration * sampleRate), sampleRate)
    const track = output.createBufferSource()
    track.buffer = source
    track.connect(output.destination)
    track.start()
    const samples = (await output.startRendering()).getChannelData(0)
    const bytes = new ArrayBuffer(44 + samples.length * 2)
    const view = new DataView(bytes)
    const put = (offset: number, label: string) => [...label].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)))
    put(0, 'RIFF')
    view.setUint32(4, bytes.byteLength - 8, true)
    put(8, 'WAVE')
    put(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    put(36, 'data')
    view.setUint32(40, samples.length * 2, true)
    samples.forEach((value, index) => view.setInt16(44 + index * 2, Math.max(-32768, Math.min(32767, Math.round(value * 32768))), true))
    return new Blob([bytes], { type: 'audio/wav' })
  } finally {
    await decoder.close()
  }
}

export async function requestFeedback(request: CoachRequest, audio: Blob | undefined, signal: AbortSignal) {
  const form = new FormData()
  form.set('request', JSON.stringify(request))
  if (audio) {
    let wav
    try { wav = await wavFor(audio) } catch (error) {
      if (error instanceof Error && error.message.startsWith('Hãy chọn')) throw error
      throw new Error('Trình duyệt không đọc được bản ghi này. Bạn có thể tải bản ghi và gửi cùng mẫu nhờ chấm.')
    }
    form.set('audio', wav, 'speaking.wav')
  }
  let response
  try {
    response = await fetch(endpoint, { method: 'POST', body: form, signal, credentials: 'omit', headers: { 'X-IELTS-Coach': '1' } })
  } catch (error) {
    if (signal.aborted) throw error
    throw new Error('Chưa kết nối được dịch vụ chấm. Trên Ubuntu, hãy mở bản có AI hoặc cho phép truy cập mạng cục bộ nếu Chrome hỏi. Bạn cũng có thể dùng mẫu nhờ chấm.')
  }
  const payload: unknown = await response.json()
  if (!response.ok) {
    const message = (payload as { error?: string } | null)?.error
    throw new Error(message || 'Chưa nhận được phản hồi. Hãy thử lại.')
  }
  return coachFeedbackSchema.parse(payload)
}
