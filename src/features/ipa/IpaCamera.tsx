import { useEffect, useRef, useState } from 'react'

export function IpaCamera() {
  const [stream, setStream] = useState<MediaStream>()
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState('')
  const camera = useRef<HTMLVideoElement>(null)
  const current = useRef<MediaStream>(undefined)
  const generation = useRef(0)

  function close() {
    generation.current++
    current.current?.getTracks().forEach(track => track.stop())
    current.current = undefined
    setStream(undefined)
    setRequesting(false)
  }

  useEffect(() => () => {
    generation.current++
    current.current?.getTracks().forEach(track => track.stop())
  }, [])
  useEffect(() => {
    if (stream && camera.current) camera.current.srcObject = stream
  }, [stream])

  async function open() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Trình duyệt này chưa hỗ trợ xem camera.')
      return
    }
    const request = ++generation.current
    setError('')
    setRequesting(true)
    try {
      const video = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' } }, audio: false })
      if (request !== generation.current) {
        video.getTracks().forEach(track => track.stop())
        return
      }
      current.current = video
      setStream(video)
    } catch {
      if (request === generation.current) setError('Không mở được camera. Kiểm tra quyền camera trên thiết bị.')
    } finally {
      if (request === generation.current) setRequesting(false)
    }
  }

  return <div className="ipa-camera stack">
    <div className="row">
      {stream || requesting
        ? <button type="button" onClick={close}>{requesting ? 'Hủy mở camera' : 'Tắt camera'}</button>
        : <button type="button" onClick={() => void open()}>Soi khẩu hình bằng camera</button>}
      {requesting && <small role="status">Đang chờ quyền camera…</small>}
    </div>
    {error && <p role="status" className="muted">{error}</p>}
    {stream && <div className="ipa-camera-view">
      <video ref={camera} autoPlay playsInline muted aria-label="Hình ảnh camera của bạn" />
      <small>Hình ảnh chỉ hiển thị trên thiết bị của bạn.</small>
    </div>}
  </div>
}
