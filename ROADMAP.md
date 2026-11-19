# Lộ trình

## MVP

Đo mức độ đều đặn bằng lịch hoạt động và streak. Kết nối phát âm, động từ, cấu trúc, đề mô phỏng và phiên trộn với một sổ lỗi và lịch SM-2. Triển khai tĩnh và di chuyển tiến độ bằng JSON.

## V2

- Dùng chẩn đoán theo kỹ năng để cấp bài theo band mục tiêu và khoảng trống kiến thức. Ưu tiên lỗi tái diễn trong phiên ngắn.
- Biên tập corpus có version, giấy phép, tác giả và reviewer. Thêm đề đầy đủ, audio thu sẵn có mốc transcript và kiểm tra chéo đáp án Reading/Listening.
- Thử IndexedDB và đồng bộ tùy chọn qua Supabase. Kiểm tra phục hồi mất mạng, nhập v1 và xung đột nhiều thiết bị.
- Đo tỷ lệ hoàn thành tuần đầu, tỷ lệ quay lại sau ngày bỏ lỡ, độ chính xác sau 7 ngày và thời lượng thực học.

## V3

- So sánh SM-2 và FSRS bằng tỷ lệ nhớ lại dự báo và tải ôn mỗi ngày trước khi chuyển lịch.
- Thêm chấm Writing/Speaking có giáo viên hiệu chuẩn, chỉ ra bằng chứng theo từng tiêu chí và độ tin cậy.
- Mở corpus nhiều cấp độ và phân tích lỗi theo kỹ năng. Đánh giá mô hình khẩu hình trực quan với người học Việt và chuyên gia ngữ âm.
