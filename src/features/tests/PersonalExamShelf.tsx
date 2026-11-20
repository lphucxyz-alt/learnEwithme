import { useEffect, useRef, useState } from 'react'
import { deletePersonalExam, getPersonalExam, listPersonalExams, savePersonalExam, type PersonalExamFile } from '../../services/personal-exams'

function fileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function PersonalExamShelf() {
  const [papers, setPapers] = useState<PersonalExamFile[]>([])
  const [selected, setSelected] = useState('')
  const [preview, setPreview] = useState<{ id: string; url?: string; error?: string }>()
  const [message, setMessage] = useState('')
  const picker = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void listPersonalExams().then(setPapers).catch(() => setMessage('Trình duyệt chưa mở được kho lưu đề.'))
  }, [])

  useEffect(() => {
    if (!selected) return
    let disposed = false
    let objectUrl = ''
    void getPersonalExam(selected).then(blob => {
      if (disposed) return
      if (!blob) {
        setPreview({ id: selected, error: 'Không tìm thấy tệp PDF trên thiết bị.' })
        return
      }
      objectUrl = URL.createObjectURL(blob)
      setPreview({ id: selected, url: objectUrl })
    }).catch(() => {
      if (!disposed) setPreview({ id: selected, error: 'Không mở được tệp này trên thiết bị.' })
    })
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
      const header = await file.slice(0, 1024).text()
      if (!header.includes('%PDF-')) {
        setMessage('Tệp đã chọn không chứa tài liệu PDF hợp lệ.')
        return
      }
      const pdf = file.type === 'application/pdf' ? file : new File([file], file.name, { type: 'application/pdf', lastModified: file.lastModified })
      const paper = await savePersonalExam(pdf)
      setPapers(await listPersonalExams())
      setPreview(undefined)
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
      setSelected(current => current === id ? '' : current)
      setPreview(current => current?.id === id ? undefined : current)
      setMessage('Đã gỡ tệp khỏi thiết bị này.')
    } catch {
      setMessage('Không gỡ được tệp đề.')
    }
  }

  const paper = papers.find(item => item.id === selected)
  const currentPreview = preview?.id === selected ? preview : undefined
  function closePreview() {
    setSelected('')
    setPreview(undefined)
  }

  return <section className="panel stack personal-exam-shelf">
    <div className="between"><div className="stack"><h2>Đề bạn có sẵn · làm ngay trong web</h2>
      <p className="muted">Thêm PDF đề IELTS bạn có quyền sử dụng. Ứng dụng giữ file riêng trong trình duyệt này, không tải lên GitHub hay máy chủ.</p>
    </div><button className="primary" type="button" onClick={() => picker.current?.click()}>Thêm đề PDF</button></div>
    <input ref={picker} className="personal-exam-file" type="file" accept="application/pdf,.pdf" aria-label="Chọn PDF đề IELTS của bạn" onChange={event => { void importPaper(event.target.files?.[0]); event.target.value = '' }} />
    {message && <p role="status" className="muted">{message}</p>}
    {!papers.length && <p className="personal-exam-empty">Chưa có PDF nào trên thiết bị. Thêm đề bạn sở hữu để mở và đọc trực tiếp tại đây.</p>}
    {papers.length > 0 && <div className="personal-exam-list">{papers.map(paper => <article key={paper.id} className="personal-exam-row" data-selected={selected === paper.id}>
      <button type="button" className="personal-exam-open" aria-pressed={selected === paper.id} onClick={() => {
        if (selected === paper.id) return
        setPreview(undefined)
        setSelected(paper.id)
      }}><strong>{paper.name}</strong><small>{fileSize(paper.size)} · đã thêm {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(paper.addedAt))}</small></button>
      <button type="button" onClick={() => void removePaper(paper.id)}>Gỡ</button>
    </article>)}</div>}
    {selected && <div className="personal-exam-viewer">
      <div className="between"><strong>{paper?.name}</strong><div className="row">
        {currentPreview?.url && <a className="button" href={currentPreview.url} download={paper?.name}>Tải PDF</a>}
        <button type="button" onClick={closePreview}>Đóng đề</button>
      </div></div>
      {currentPreview?.url ? navigator.pdfViewerEnabled === false
        ? <p>Trình duyệt này cần tải PDF để đọc tệp.</p>
        : <iframe title="Đề IELTS PDF trên thiết bị của bạn" src={currentPreview.url} />
        : <p role="status">{currentPreview?.error ?? 'Đang mở PDF…'}</p>}
    </div>}
  </section>
}
