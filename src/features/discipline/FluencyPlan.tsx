import { Link } from 'react-router-dom'
import { useStudy } from '../../app/StudyProvider'
import { Listen } from '../../components/Audio'

const plan = [
  ['Học từ trong ngữ cảnh', 'Tra nghĩa tiếng Việt nếu cần, rồi viết hai câu về đời sống của mình. Đọc to và gắn hình ảnh nếu có thể.'],
  ['Đọc hoặc nghe vừa sức', 'Dành 15–20 phút mỗi ngày cho nội dung bạn hiểu gần hết. Tìm lại những từ đã gặp để nhận diện nhanh hơn.'],
  ['Luyện nói 4/3/2', 'Ba buổi mỗi tuần, nói cùng một đề trong 4 phút. Nghe lại, sửa lỗi, rồi nói trong 3 phút và 2 phút. Ghi lại những cụm tự nhiên bạn dùng lại.'],
  ['Tự nói mỗi ngày', 'Mô tả việc đang làm hoặc nhẩm câu trả lời vài phút. Ghi lại nơi bạn bị khựng để tra sau.'],
  ['Đo tiến độ mỗi tháng', 'Ghi âm lại cùng một đề Speaking. So với bản trước về khoảng lặng và các cụm bạn có thể nói tự nhiên.']
]
const schedule = [
  ['Thứ 2, 4, 6', '20 phút luyện nói 4/3/2 với một đề', '15 phút nghe podcast vừa sức'],
  ['Thứ 3, 5', '20 phút đọc báo hoặc đọc lại bài Reading', '10 phút đặt câu với từ mới'],
  ['Thứ 7, Chủ nhật', 'Ghi âm 3 phút kể lại cả tuần', '15 phút đọc hoặc nghe vừa sức'],
  ['Mỗi ngày', 'Vài phút tự nói bằng tiếng Anh', 'Ghi chú các cụm bị kẹt']
]

export function FluencyPlan({ weekday }: { weekday: number }) {
  const { complete } = useStudy()
  const row = [2, 0, 1, 0, 1, 0, 2][weekday]
  return <section className="panel stack">
    <h2>Lộ trình luyện phản xạ</h2>
    <div className="catalog-item"><h3>Lịch mẫu hôm nay</h3><p>{schedule[row][1]} · {schedule[row][2]}</p>
      <div className="row"><Link className="button primary" to="/practice/speaking">Luyện nói 4/3/2</Link>
        <button onClick={() => complete('practice', 4)}>Ghi nhận một lượt tự nói</button></div>
    </div>
    <details><summary>5 bước thực hành</summary><ol className="stack">{plan.map(([title, detail]) => <li key={title}><strong>{title}</strong><p>{detail}</p></li>)}</ol></details>
    <details><summary>Lịch mẫu trong tuần</summary><div className="stack">{schedule.map(([day, main, extra]) =>
      <div key={day}><strong>{day}</strong><p>{main} · {extra}</p></div>)}</div></details>
    <p>Bạn có thể dịch ở lần gặp đầu. Khi gặp lại và nói đủ nhiều, hãy tập gọi cả cụm theo ý mình muốn diễn đạt.</p>
    <div className="row">{["I'd definitely say…", 'The main reason is that…', "It's much more convenient."].map(chunk => <Listen key={chunk} text={chunk} label={chunk} />)}</div>
  </section>
}
