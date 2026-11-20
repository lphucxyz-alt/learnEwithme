import { useEffect, useRef, useState } from 'react'
import { deletePersonalExam, getPersonalExam, listPersonalExams, savePersonalExam, type PersonalExamFile } from '../../services/personal-exams'

function fileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function PersonalExamShelf() {
  const [papers, setPapers] = useState<PersonalExamFile[]>([])
  const [selected, setSelected] = useState('')
  const [preview, setPreview] = useState('')
  const [message, setMessage] = useState('')
  const picker = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void listPersonalExams().then(setPapers).catch(() => setMessage('Trình duyệt chưa mở được kho lưu đề.'))
  }, [])

  useEffect(() => {
    setPreview('')
    if (!selected) return
    let disposed = false
    let objectUrl = ''
    void getPersonalExam(selected).then(blob => {
      if (disposed) return
      if (!blob) { setMessage('Không tìm thấy tệp PDF trên thiết bị.'); return }
      objectUrl = URL.createObjectURL(blob)
      setPreview(objectUrl)
    }).catch(() => { if (!disposed) setMessage('Không mở được tệp này trên thiết bị.') })
    return () => {
      disposed = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [selected])

  async function importPaper(file?: File) {
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setMessage('Chọn tệp PDF để mở đề ngay trong ứng dụng.')
      return
    }
    if (file.size > 40 * 1024 * 1024) {
      setMessage('Tệp cần nhỏ hơn 40 MB để lưu ổn định trên điện thoại.')
      return
    }
    try {
      const paper = await savePersonalExam(file)
      setPapers(await listPersonalExams())
      setSelected(paper.id)
      setMessage('Đề đã lưu riêng trong trình duyệt trên thiết bị này.')
    } catch {
      setMessage('Thiết bị hết dung lượng hoặc không cho phép lưu tệp đề.')
    }
  }

  async function removePaper(id: string) {
    try {
      await deletePersonalExam(id)
      setPapers(await listPersonalExams())
      if (selected === id) setSelected('')
      setMessage('Đã gỡ tệp khỏi thiết bị này.')
    } catch {
      setMessage('Không gỡ được tệp đề.')
    }
  }

  return <section className="panel stack personal-exam-shelf">
    <div className="between"><div className="stack"><h2>Đề bạn có sẵn · làm ngay trong web</h2>
      <p className="muted">Thêm PDF đề IELTS bạn có quyền sử dụng. Ứng dụng giữ file riêng trong trình duyệt này, không tải lên GitHub hay máy chủ.</p>
    </div><button className="primary" type="button" onClick={() => picker.current?.click()}>Thêm đề PDF</button></div>
    <input ref={picker} className="personal-exam-file" type="file" accept="application/pdf,.pdf" aria-label="Chọn PDF đề IELTS của bạn" onChange={event => { void importPaper(event.target.files?.[0]); event.target.value = '' }} />
    {message && <p role="status" className="muted">{message}</p>}
    {!papers.length && <p className="personal-exam-empty">Chưa có PDF nào trên thiết bị. Thêm đề bạn sở hữu để mở và đọc trực tiếp tại đây.</p>}
    {papers.length > 0 && <div className="personal-exam-list">{papers.map(paper => <article key={paper.id} className="personal-exam-row" data-selected={selected === paper.id}>
      <button type="button" className="personal-exam-open" aria-pressed={selected === paper.id} onClick={() => setSelected(paper.id)}><strong>{paper.name}</strong><small>{fileSize(paper.size)} · đã thêm {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(paper.addedAt))}</small></button>
      <button type="button" onClick={() => void removePaper(paper.id)}>Gỡ</button>
    </article>)}</div>}
    {selected && <div className="personal-exam-viewer">
      <div className="between"><strong>{papers.find(paper => paper.id === selected)?.name}</strong><button type="button" onClick={() => setSelected('')}>Đóng đề</button></div>
      {preview ? <iframe title="Đề IELTS PDF trên thiết bị của bạn" src={preview} /> : <p role="status">Đang mở PDF…</p>}
    </div>}
  </section>
}
