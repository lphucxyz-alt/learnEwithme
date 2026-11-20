# IELTS Discipline OS

Lộ trình tự học hướng tới IELTS 6.5. Trang chủ gợi ý bài nền tảng tiếp theo dựa trên kết quả đã lưu, rồi dẫn đến các bài làm quen của từng kỹ năng. Tra cứu, luyện chủ động, thi thử, phân tích lỗi và ôn lại theo lịch SM-2.

## Chạy trên máy

Yêu cầu Node.js 22.18 trở lên.

```sh
npm ci
npm run dev
npm run build
npm test
npx tsc --noEmit
npm run preview
```

Vite phục vụ tại đường dẫn `/learnEwithme/`. URL dùng hash, ví dụ `/learnEwithme/#/tests/urban-trees`, để tải lại trang con trực tiếp.

## Sử dụng

- Trung tâm có lửa chuỗi đổi màu ở các mốc 1/10/30/60/100/365, nhiệm vụ, XP, lịch và thẻ đến hạn. Mỗi 7 ngày học liên tục nhận một khiên cho một ngày bỏ lỡ. Pomodoro ghi phút khi kết thúc phiên tập trung.
- Nền tảng có 46 bài, 243 câu có giải thích tiếng Việt theo A1–B1, từ mạo từ và giới từ đến 12 dạng thì thường học và câu phức. Câu sai chuyển vào lịch ôn SM-2.
- IPA có 44 âm với khẩu hình chính diện, mặt cắt khoang miệng và thanh tua chuyển động. Mỗi âm có ba từ để luyện nhận diện hoặc nghe chép. Làm đúng ít nhất hai câu trong lượt để lưu tiến độ. Sổ ôn nhận câu làm sai. Bài nghe phân biệt 20 câu vẫn có sẵn.
- Shadowing là mục riêng gồm sáu bài A1–B1. Bài có lời tiếng Anh, bản dịch, mẫu nghe cả bài hoặc từng câu, tốc độ và bản ghi tự đối chiếu. Tiến độ Shadowing lưu riêng trong trình duyệt. Camera và bản ghi tự đối chiếu chỉ dùng trên thiết bị trong phiên học.
- Động từ có 165 mục, ba dạng, ví dụ, IPA và nhóm biến đổi. CEFR trong kho là mức tham khảo. Phiên âm ban đầu được tạo bằng eSpeak NG với một số từ đa âm được chỉnh riêng.
- Kho cấu trúc có ví dụ cơ bản và nâng cấp kèm bài ghép và biến đổi. Bài nhập chữ được so với các đáp án chấp nhận trong học liệu.
- Kho đề có 20 bài tự biên soạn, gồm 5 bài mỗi kỹ năng và nguồn đề chính thức IELTS để luyện thêm. Reading và Listening là các bài theo phần. Quy đổi band của mẫu Reading/Listening mang tính minh họa. Writing dùng rubric tự chấm và Speaking dùng nghe lại.
- Luyện nhanh có chế độ ngữ pháp theo trình độ và chế độ trộn thẻ đến hạn, IPA, động từ, cấu trúc. Lựa chọn mới ưu tiên nội dung chưa gặp và lưu lịch chọn cùng tiến độ. Luyện nói 4/3/2 hỗ trợ ghi âm, ghi chú cụm từ và mở bản ghi cũ để đối chiếu. Hãy tải file ghi âm trước khi rời trang.
- Nhấn **Ctrl+K**, **Cmd+K** hoặc **/** để mở tìm kiếm. Dùng **Space** để lật thẻ, **←/→** để chuyển flashcard, **Enter** để nộp biểu mẫu, **1–4** để chấm thẻ SRS đã lật.
- Dùng **Cài đặt → Xuất bản sao lưu** rồi nhập JSON trên thiết bị khác. Sao lưu chứa tiến độ, lịch sử đề, sổ lỗi, cài đặt và ghi chú 4/3/2.

Micro cần HTTPS hoặc localhost và quyền trình duyệt. Cài app qua menu **Thêm vào màn hình chính**. App shell có thể mở ngoại tuyến sau lần tải đầu. Âm thanh từ điển cần mạng và đọc văn bản tùy giọng có sẵn trên thiết bị.

### Giọng mẫu IPA và Shadowing

Từ và câu dựng sẵn dùng Kokoro 1.0 với giọng `bf_emma` và `af_heart`. GitHub Pages phát tệp MP3 trực tiếp. Mã và trọng số mô hình chỉ dùng khi tạo học liệu. [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M) · [Bản ONNX](https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)

Để tạo lại các tệp, dùng môi trường Python có `kokoro-onnx==0.4.9` và `soundfile`, cùng Node và FFmpeg. Chạy `python scripts/render-ipa-voice.py /path/kokoro-v1.0.int8.onnx /path/voices-v1.0.bin`. Thêm `--force` nếu cần tạo lại mẫu đã có.

## AI góp ý cho Speaking và Writing

Trong **Luyện nói 4/3/2** hoặc phần Speaking, dừng ghi và bấm **Chấm với AI** dưới bản ghi. Ở Writing, nộp bài rồi chọn Task cần góp ý. Nhận xét gồm tối đa ba lỗi, gợi ý sửa câu và một việc để luyện lần sau. Chấm lượt dài trước để AI có thể so sánh khi chấm lượt sau cùng chủ đề. Lưu từng lỗi vào sổ ôn và xem các nhận xét còn lưu trong Trung tâm.

Dịch vụ chấm dùng khóa Gemini từ môi trường của tiến trình Node.js trên Ubuntu. Khi khóa đã được cấu hình, chạy:

```sh
npm run build
npm run coach
```

Mở [4/3/2 trên Ubuntu](http://127.0.0.1:4174/learnEwithme/#/practice/speaking) hoặc dùng Chrome truy cập GitHub Pages trên chính máy Ubuntu trong khi dịch vụ đang chạy. Cho phép truy cập mạng cục bộ nếu Chrome hỏi. Hai địa chỉ có bộ nhớ trình duyệt riêng. Để giữ tiến độ của GitHub Pages, hãy tiếp tục ở địa chỉ đó hoặc chuyển bằng sao lưu JSON.

Backend lắng nghe trên loopback, kiểm tra origin và giới hạn lượt chấm. Nó gửi bài tới Gemini chỉ khi người học bấm chấm và giữ khóa ngoài bản build. Bản chép lời cùng nhận xét nằm trong lịch sử riêng của trình duyệt và bản sao lưu tiến độ. Tệp ghi âm giữ trong phiên. Trên thiết bị chưa kết nối dịch vụ, dùng **Sao chép yêu cầu** để nhờ AI phản hồi và đính kèm file ghi âm nếu có.

## GitHub Pages

1. Vào **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**.
2. Mở **Actions → Deploy GitHub Pages → Run workflow** trên nhánh `main`. Khi workflow thành công, mở [IELTS Discipline OS](https://lphucxyz-alt.github.io/learnEwithme/).

Xem [kiến trúc](ARCHITECTURE.md) và [lộ trình](ROADMAP.md).
