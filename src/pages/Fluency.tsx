import { Link } from 'react-router-dom'
import { exams } from '../features/tests/catalog'
import { Speaking } from '../features/tests/Speaking'

export default function Fluency() {
  const exam = exams.find(item => item.skill === 'Speaking')
  return <>
    <header className="page-head"><Link className="text-link" to="/practice">Luyện nhanh</Link><h1>Luyện nói 4/3/2</h1>
      <p>Chọn một đề và giữ nguyên qua ba lượt. Nghe lại sau mỗi lượt, sửa chỗ bị khựng rồi rút ngắn còn 3 và 2 phút.</p>
      <p>Tải bản ghi để lần sau mở cùng đề và so khoảng lặng, tốc độ nhớ lại cụm từ.</p></header>
    {exam && <Speaking parts={exam.parts} fluency />}
  </>
}
