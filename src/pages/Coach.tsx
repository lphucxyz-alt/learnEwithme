import { Link } from 'react-router-dom'
import { useStudy } from '../app/StudyProvider'
import { Feedback } from '../features/coach/Feedback'

export default function Coach() {
  const { state } = useStudy()
  return <>
    <header className="page-head"><h1>Nhận xét đã lưu</h1><p>Xem lại lỗi cần sửa và việc nên thử ở bài tiếp theo.</p></header>
    {!state.coachHistory.length && <section className="panel stack"><p>Chưa có nhận xét AI. Hãy thử chấm một lượt ghi âm.</p><Link className="button primary" to="/practice/speaking">Mở luyện nói 4/3/2</Link></section>}
    {state.coachHistory.map(entry => <details className="panel" key={entry.id}>
      <summary><strong>{entry.topic}</strong> · {new Date(entry.at).toLocaleDateString('vi')}</summary>
      <Feedback entry={entry} />
    </details>)}
  </>
}
