export interface IpaGuidePage {
  title: string
  eyebrow: string
  summary: string
  image: string
  sounds: string[]
}

export const ipaGuidePages: IpaGuidePage[] = [
  {
    title: 'Bản đồ 44 âm tiếng Anh',
    eyebrow: 'BẮT ĐẦU TỪ ĐÂY',
    summary: 'Nhìn nhanh 12 nguyên âm đơn, 8 nguyên âm đôi và 24 phụ âm. Chọn một âm bên dưới để mở bài luyện khẩu hình.',
    image: '44-am-tong-quan.webp',
    sounds: ['iː', 'ɪ', 'e', 'æ', 'ʌ', 'ɑː', 'ɒ', 'ɔː', 'ʊ', 'uː', 'ɜː', 'ə', 'ɪə', 'eɪ', 'ʊə', 'ɔɪ', 'əʊ', 'eə', 'aɪ', 'aʊ', 'p', 'b', 't', 'd', 'tʃ', 'dʒ', 'k', 'ɡ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'm', 'n', 'ŋ', 'l', 'r', 'w', 'j'],
  },
  {
    title: '12 nguyên âm đơn',
    eyebrow: 'BÀI 01 · GIỮ ÂM ỔN ĐỊNH',
    summary: 'Tập nhận ra độ cao của lưỡi, độ mở hàm và môi tròn hay thả lỏng. So sánh âm dài với âm ngắn thay vì chỉ đọc nhanh hay chậm.',
    image: '12-nguyen-am-don.webp',
    sounds: ['iː', 'ɪ', 'ʊ', 'uː', 'e', 'ə', 'ɜː', 'æ', 'ʌ', 'ɑː', 'ɒ', 'ɔː'],
  },
  {
    title: '8 nguyên âm đôi',
    eyebrow: 'BÀI 02 · LƯỚT LIỀN MỘT ÂM TIẾT',
    summary: 'Bắt đầu ở vị trí thứ nhất rồi để lưỡi và môi chuyển động đến vị trí thứ hai. Đừng ngắt thành hai âm riêng.',
    image: '8-nguyen-am-doi.webp',
    sounds: ['ɪə', 'eɪ', 'ʊə', 'ɔɪ', 'əʊ', 'eə', 'aɪ', 'aʊ'],
  },
  {
    title: 'Phụ âm tắc và âm bật',
    eyebrow: 'BÀI 03 · CHẶN HƠI RỒI NHẢ',
    summary: 'Cảm nhận luồng hơi khi bật /p, t, k/. Với các cặp hữu thanh như /b, d, ɡ/, đặt tay lên cổ để cảm nhận dây thanh rung.',
    image: '8-phu-am-tac.webp',
    sounds: ['p', 'b', 't', 'd', 'tʃ', 'dʒ', 'k', 'ɡ'],
  },
  {
    title: 'Phụ âm xát',
    eyebrow: 'BÀI 04 · GIỮ LUỒNG HƠI',
    summary: 'Để hơi đi liên tục qua khe hẹp. So sánh /θ/ với /ð/ bằng vị trí lưỡi giống nhau và độ rung khác nhau.',
    image: '8-phu-am-xat.webp',
    sounds: ['f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ'],
  },
  {
    title: 'Âm mũi và âm lướt',
    eyebrow: 'BÀI 05 · HƯỚNG ĐI CỦA HƠI',
    summary: 'Với /m, n, ŋ/, hơi đi qua mũi. Với /l, r, w, j/, luồng hơi đi qua miệng và khẩu hình chuẩn bị cho âm tiếp theo.',
    image: '8-phu-am-mui-va-luot.webp',
    sounds: ['h', 'm', 'n', 'ŋ', 'l', 'r', 'w', 'j'],
  },
]
