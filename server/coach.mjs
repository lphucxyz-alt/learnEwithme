import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { z } from 'zod'
import { coachFeedbackSchema, coachRequestSchema } from '../src/types/coach.ts'
import { groundedFeedback } from './feedback.mjs'
import { coachInstructions, coachTask } from '../src/features/coach/instructions.ts'

const port = 4174
const root = resolve('dist')
const appBase = '/learnEwithme/'
const origins = new Set(['https://lphucxyz-alt.github.io', 'http://127.0.0.1:' + port, 'http://localhost:' + port])
const hosts = new Set(['127.0.0.1:' + port, 'localhost:' + port])
const maxBodyBytes = 11 * 1024 * 1024
const hour = 60 * 60 * 1000
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json'
}
const model = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash-lite'
const apiKey = process.env.GEMINI_API_KEY
const responseSchema = z.toJSONSchema(coachFeedbackSchema, { target: 'draft-7' })
delete responseSchema.$schema
const requests = []
let grading = false

function send(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(payload))
}

async function grade(input, audio, signal) {
  const parts = [{ text: coachTask(input, Boolean(audio)) }]
  if (audio) parts.push({ inlineData: { mimeType: 'audio/wav', data: Buffer.from(await audio.arrayBuffer()).toString('base64') } })
  const upstream = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, signal,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: coachInstructions }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { responseMimeType: 'application/json', responseJsonSchema: responseSchema, maxOutputTokens: 6500, thinkingConfig: { thinkingLevel: 'low' } }
    })
  })
  if (!upstream.ok) {
    console.error('Coach provider HTTP', upstream.status)
    return { status: upstream.status === 429 ? 429 : 502, error: upstream.status === 429
      ? 'Dịch vụ AI đang giới hạn lượt chấm. Bạn có thể thử lại sau.'
      : 'Dịch vụ AI chưa trả được kết quả. Bạn có thể thử lại.' }
  }
  const result = await upstream.json()
  const raw = result.candidates?.[0]?.content?.parts?.filter(part => !part.thought).map(part => part.text ?? '').join('')
  if (!raw) throw new Error('No feedback from provider')
  const feedback = coachFeedbackSchema.parse(JSON.parse(raw))
  return { status: 200, feedback: groundedFeedback(feedback, input, Boolean(audio)) }
}

async function respond(request, response) {
  const origin = request.headers.origin
  if (!hosts.has(request.headers.host)) return send(response, 403, { error: 'Địa chỉ máy chấm không hợp lệ.' })
  const path = new URL(request.url, 'http://localhost').pathname
  if (path === '/api/coach') {
    if (!origins.has(origin)) return send(response, 403, { error: 'Trang này chưa được cấp quyền gửi bài chấm.' })
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-IELTS-Coach')
    response.setHeader('Access-Control-Allow-Private-Network', 'true')
    response.setHeader('Vary', 'Origin')
    if (request.method === 'OPTIONS') {
      response.writeHead(204).end()
      return
    }
    if (request.method !== 'POST' || request.headers['x-ielts-coach'] !== '1') return send(response, 405, { error: 'Yêu cầu chấm không hợp lệ.' })
    if (!apiKey) return send(response, 503, { error: 'Máy chấm chưa được cấu hình GEMINI_API_KEY.' })
    if (!String(request.headers['content-type']).startsWith('multipart/form-data;')) return send(response, 415, { error: 'Định dạng dữ liệu không hợp lệ.' })
    if (Number(request.headers['content-length']) > maxBodyBytes) return send(response, 413, { error: 'Bản ghi quá lớn.' })
    if (grading) return send(response, 429, { error: 'AI đang chấm một bài khác. Hãy thử lại sau.' })
    while (requests[0] < Date.now() - hour) requests.shift()
    if (requests.length >= 24) return send(response, 429, { error: 'Đã đủ 24 lượt chấm trong một giờ. Hãy thử lại sau.' })
    grading = true
    try {
      let total = 0
      const chunks = []
      for await (const chunk of request) {
        total += chunk.length
        if (total > maxBodyBytes) {
          send(response, 413, { error: 'Bản ghi quá lớn.' })
          return
        }
        chunks.push(chunk)
      }
      let input, audio
      try {
        const form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers['content-type'] } }).formData()
        input = coachRequestSchema.parse(JSON.parse(String(form.get('request'))))
        audio = form.get('audio')
        if (input.mode === 'writing' ? !input.answer || audio : !(audio instanceof Blob) || audio.type !== 'audio/wav' || audio.size < 1000) throw new Error()
      } catch {
        return send(response, 400, { error: 'Chưa có bài làm hoặc bản ghi hợp lệ để chấm.' })
      }
      requests.push(Date.now())
      const controller = new AbortController()
      const cancelled = () => { if (!response.writableEnded) controller.abort() }
      response.once('close', cancelled)
      const result = await grade(input, audio, AbortSignal.any([controller.signal, AbortSignal.timeout(75000)]))
      if (!response.destroyed) send(response, result.status, result.feedback ?? { error: result.error })
    } catch {
      if (!response.destroyed) send(response, 502, { error: 'Chưa chấm xong bài này. Hãy thử lại với đoạn ngắn hơn.' })
    } finally {
      grading = false
    }
    return
  }
  if (path === '/') {
    response.writeHead(302, { Location: appBase }).end()
    return
  }
  if (request.method !== 'GET' || !path.startsWith(appBase)) return send(response, 404, { error: 'Không tìm thấy trang.' })
  let file
  try {
    file = resolve(root, decodeURIComponent(path.slice(appBase.length)) || 'index.html')
    if (!file.startsWith(root + sep) || !(await stat(file)).isFile()) throw new Error()
    const content = await readFile(file)
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' })
    response.end(content)
  } catch {
    send(response, 404, { error: 'Không tìm thấy tệp. Hãy chạy npm run build.' })
  }
}

if (!/^[a-z0-9.-]+$/i.test(model)) throw new Error('GEMINI_MODEL không hợp lệ.')
const server = createServer({ requestTimeout: 20000, headersTimeout: 10000 }, (request, response) => {
  void respond(request, response).catch(() => {
    if (!response.headersSent && !response.destroyed) send(response, 500, { error: 'Dịch vụ chấm gặp sự cố.' })
  })
})
server.listen(port, '127.0.0.1', () => console.log('IELTS Coach: http://127.0.0.1:' + port + appBase))
