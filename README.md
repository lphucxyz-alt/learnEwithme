# IELTS Discipline OS

Luyện IELTS theo vòng học mỗi ngày. Tra cứu, luyện chủ động, thi thử, phân tích lỗi và ôn lại theo lịch SM-2.

## Chạy trên máy

Yêu cầu Node.js 22.18 trở lên.

```sh
npm ci
npm run dev
npm run build
npx tsc --noEmit
npm run preview
```

Vite phục vụ tại đường dẫn `/learnEwithme/`. URL dùng hash, ví dụ `/learnEwithme/#/tests/urban-trees`, để tải lại trang con trực tiếp.

## Sử dụng

- Trung tâm hiển thị XP, lịch hoạt động, streak, shield, nhiệm vụ và thẻ đến hạn. Pomodoro ghi phút khi kết thúc phiên tập trung.
- IPA có 44 âm, biểu đồ cấu âm, bài phân biệt và phòng shadowing. Bảng âm có bản thu IPA và mẫu tổng hợp dự phòng. Bản thu từ điển được dùng khi có giọng phù hợp. Đoạn văn được gửi tới bộ đọc của trình duyệt.
- Động từ có 165 mục, ba dạng, ví dụ, IPA và nhóm biến đổi. CEFR trong kho là mức tham khảo. Phiên âm ban đầu được tạo bằng eSpeak NG với một số từ đa âm được chỉnh riêng.
- Kho cấu trúc có ví dụ cơ bản và nâng cấp kèm bài ghép và biến đổi. Bài nhập chữ được so với các đáp án chấp nhận trong học liệu.
- Kho đề có bốn bài mô phỏng tự biên soạn theo kỹ năng. Quy đổi band của mẫu Reading/Listening mang tính minh họa. Writing dùng rubric tự chấm và Speaking dùng nghe lại.
- Luyện nhanh phối hợp thẻ đến hạn, IPA, động từ và cấu trúc. Luyện nói 4/3/2 hỗ trợ ghi âm, ghi chú cụm từ và mở bản ghi cũ để đối chiếu. Hãy tải file ghi âm trước khi rời trang.
- Nhấn **Ctrl+K**, **Cmd+K** hoặc **/** để mở tìm kiếm. Dùng **Space** để lật thẻ, **←/→** để chuyển flashcard, **Enter** để nộp biểu mẫu, **1–4** để chấm thẻ SRS đã lật.
- Dùng **Cài đặt → Xuất bản sao lưu** rồi nhập JSON trên thiết bị khác. Sao lưu chứa tiến độ, lịch sử đề, sổ lỗi, cài đặt và ghi chú 4/3/2.

Micro cần HTTPS hoặc localhost và quyền trình duyệt. Cài app qua menu **Thêm vào màn hình chính**. App shell có thể mở ngoại tuyến sau lần tải đầu. Âm thanh từ điển cần mạng và đọc văn bản tùy giọng có sẵn trên thiết bị.

## GitHub Pages

1. Vào **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**.
2. Mở **Actions → Deploy GitHub Pages → Run workflow** trên nhánh `main`. Khi workflow thành công, mở [IELTS Discipline OS](https://lphucxyz-alt.github.io/learnEwithme/).

Xem [kiến trúc](ARCHITECTURE.md) và [lộ trình](ROADMAP.md).
