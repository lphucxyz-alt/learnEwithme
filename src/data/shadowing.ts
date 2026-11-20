type ShadowLine = { en: string; vi: string }
export type ShadowLesson = { id: string; title: string; level: 'A1' | 'A2' | 'B1'; focus: string; lines: ShadowLine[] }

export const shadowLessons: ShadowLesson[] = [
  {
    id: 'coffee', title: 'Gọi đồ uống', level: 'A1', focus: 'Ngắt nhẹ sau lời chào và nhấn vào món bạn gọi.',
    lines: [
      { en: 'Hi, could I have a cup of tea?', vi: 'Chào bạn, cho tôi một tách trà được không?' },
      { en: 'I would like it with milk, please.', vi: 'Cho tôi thêm sữa nhé.' },
      { en: 'Can I pay by card?', vi: 'Tôi có thể trả bằng thẻ không?' },
      { en: 'Thanks. Have a nice day!', vi: 'Cảm ơn. Chúc bạn một ngày tốt lành!' }
    ]
  },
  {
    id: 'morning', title: 'Một buổi sáng bình thường', level: 'A1', focus: 'Đọc từng hoạt động với nhịp đều. Nhấn giờ và động từ chính.',
    lines: [
      { en: 'I get up at seven.', vi: 'Tôi thức dậy lúc bảy giờ.' },
      { en: 'Then I make some breakfast.', vi: 'Sau đó tôi chuẩn bị bữa sáng.' },
      { en: 'I usually drink a glass of water.', vi: 'Tôi thường uống một ly nước.' },
      { en: 'I leave the house at eight.', vi: 'Tôi ra khỏi nhà lúc tám giờ.' }
    ]
  },
  {
    id: 'plans', title: 'Hẹn gặp bạn bè', level: 'A2', focus: 'Nói trọn cụm hẹn giờ và địa điểm trước khi ngắt.',
    lines: [
      { en: 'Are you free this Saturday afternoon?', vi: 'Chiều thứ Bảy này bạn có rảnh không?' },
      { en: 'I thought we could meet at the station.', vi: 'Tôi nghĩ mình có thể gặp nhau ở ga.' },
      { en: 'If it rains, we can go to the café nearby.', vi: 'Nếu trời mưa, mình có thể vào quán cà phê gần đó.' },
      { en: 'Let me know what time works for you.', vi: 'Cho tôi biết giờ nào tiện cho bạn nhé.' }
    ]
  },
  {
    id: 'shopping', title: 'Đổi hàng ở cửa hàng', level: 'A2', focus: 'Giữ giọng nhẹ ở lời nhờ và nhấn vào chi tiết cần đổi.',
    lines: [
      { en: 'I bought this shirt here yesterday.', vi: 'Hôm qua tôi mua chiếc áo này ở đây.' },
      { en: 'Could I exchange it for a larger size?', vi: 'Tôi có thể đổi sang cỡ lớn hơn không?' },
      { en: 'I have the receipt with me.', vi: 'Tôi có mang hóa đơn theo.' },
      { en: 'Thanks for sorting that out.', vi: 'Cảm ơn bạn đã giúp tôi giải quyết.' }
    ]
  },
  {
    id: 'commute', title: 'Kể về đường đi làm', level: 'B1', focus: 'Ngắt ở dấu phẩy và nhấn vào thời gian, phương tiện và lý do.',
    lines: [
      { en: 'I usually give myself a few extra minutes in the morning.', vi: 'Tôi thường dành thêm vài phút dự phòng vào buổi sáng.' },
      { en: 'I used to drive to work, but now I take the bus.', vi: 'Tôi từng lái xe đi làm, nhưng giờ tôi đi xe buýt.' },
      { en: 'The main reason is that I can read on the way.', vi: 'Lý do chính là tôi có thể đọc sách trên đường đi.' },
      { en: 'It takes a little longer, but I arrive feeling more relaxed.', vi: 'Đi hơi lâu hơn một chút, nhưng khi đến nơi tôi thấy thư thái hơn.' }
    ]
  },
  {
    id: 'habits', title: 'Giữ thói quen học', level: 'B1', focus: 'Đọc liền cụm nêu nguyên nhân và chừa một nhịp trước ý đối lập.',
    lines: [
      { en: 'I used to set goals that were too ambitious.', vi: 'Trước đây tôi hay đặt những mục tiêu quá tham vọng.' },
      { en: 'These days, I make time for one short lesson.', vi: 'Dạo này tôi dành thời gian cho một bài ngắn.' },
      { en: 'Even on busy days, I can fit it in after dinner.', vi: 'Ngay cả hôm bận tôi vẫn có thể học sau bữa tối.' },
      { en: 'It feels easier to keep going when the first step is small.', vi: 'Khi bước đầu đủ nhỏ, tôi thấy dễ duy trì hơn.' }
    ]
  }
]
