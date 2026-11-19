# Kiến trúc IELTS Discipline OS

## Trụ cột sản phẩm

- Xác định trình độ xuất phát, band mục tiêu, ngày thi và ngân sách thời gian. Sau chẩn đoán, phân bổ bài theo kỹ năng yếu và đo lại bằng bài tương đương.
- Vòng học Input → Practice → Active Recall → Exam Simulation → Error Analysis. Mỗi lỗi phải có đáp án, bằng chứng hoặc tiêu chí, lần ôn kế tiếp và cơ hội kiểm tra chuyển giao.
- Giảm ma sát bằng phiên ngắn, tiếp tục bài đang làm và hiển thị bước kế tiếp. Shield được tích lũy sau tuần đủ bảy ngày, giúp bỏ lỡ một ngày mà vẫn duy trì động lực. Theo dõi mức độ đều đặn và độ chính xác và tiến độ từng kỹ năng.
- Tách luyện có hỗ trợ khỏi mô phỏng có thời gian. Writing và Speaking cần rubric, mẫu có chú giải và phản hồi của người chấm trước khi diễn giải band.

## Hệ thống

React và TypeScript quản lý giao diện. React Router dùng hash để tải lại trực tiếp trên Pages. Vite dựng bundle với base của repo. Tailwind và CSS dùng chung token giao diện. Zod kiểm tra hợp đồng nội dung và bản sao lưu.

- `src/app` chứa shell và provider. `src/pages` là điểm vào của các route.
- `src/features` chứa logic nghiệp vụ theo phân hệ. `src/components` chứa điều khiển dùng chung.
- `src/services` gồm adapter lưu trữ, Web Speech và SM-2. `src/types` định nghĩa hợp đồng.
- `src/data` giữ học liệu. Kho bài thi tự nhận JSON từ `src/data/tests` qua Vite glob và kiểm tra schema.
- Dữ liệu cá nhân lưu trong LocalStorage dưới khóa có phiên bản. Deadline ghi bằng timestamp, ngày học theo múi giờ thiết bị. Bản xuất JSON thay thế toàn bộ snapshot khi khôi phục. Ghi âm giữ trong phiên trình duyệt.

## Thêm đề thi

Sao chép JSON mẫu, đặt ID đề và ID câu ổn định và duy nhất. Giữ ID khi sửa lỗi chính tả và tạo ID mới khi thay đổi đáp án có ý nghĩa. Reading và Listening cần đáp án hợp lệ và lời giải. Writing cần đề, số từ mục tiêu và câu mẫu. Speaking cần câu hỏi theo phần, cue card và câu mẫu. Chạy kiểm tra trước khi commit và dùng nội dung tự viết hoặc đã được cấp quyền.

## Nâng cấp lưu trữ

Chuyển adapter sang IndexedDB bất đồng bộ và nhập snapshot v1 trong một transaction, sau đó chuyển file ghi âm thành blob riêng. Đồng bộ backend qua nhật ký sự kiện có ID idempotency cho XP, lượt ôn và nộp đề. Lưu draft theo revision và xử lý xung đột khi có hai thiết bị. Thực thi quyền theo user ID bằng RLS, lưu âm thanh có thời hạn và hỗ trợ xóa tài khoản. Phiên bản schema nội dung độc lập với phiên bản dữ liệu người học.

## Thành phần mở

Dùng thuật toán SM-2 với bốn mức tự đánh giá ánh xạ sang điểm chất lượng, học liệu IPA theo hệ 44 âm dùng trong dạy tiếng Anh Anh, Web Speech và MediaRecorder. Kho đề và ví dụ trong MVP do dự án biên soạn. Các mẫu diễn đạt và band ước lượng mang tính luyện tập. Biểu đồ khẩu hình minh họa cơ chế cấu âm bằng SVG.

Tham khảo [IPA Chart](https://www.internationalphoneticassociation.org/content/chart), [bảng âm tiếng Anh của British Council](https://www.teachingenglish.org.uk/teaching-resources/teaching-secondary/teaching-tools/phonemic-chart-english-teachers), [eSpeak NG](https://github.com/espeak-ng/espeak-ng) và [Free Dictionary API](https://github.com/meetDeveloper/freeDictionaryAPI). Mẫu âm đơn dùng bản thu từ biểu đồ IPA khi có mục phù hợp, với bản tổng hợp ngoại tuyến của eSpeak NG dự phòng. Từ mẫu thử âm thanh từ điển theo vùng trước khi chuyển sang giọng hệ thống. Mô tả chính sách triển khai ở [GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
