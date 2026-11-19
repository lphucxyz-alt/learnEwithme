import { lesson } from '../foundations.ts'

export const extension = [
  lesson('word-order', 'A1', 'Dựng câu', 'Trật tự từ và tân ngữ',
    'Câu kể đơn giản thường theo thứ tự chủ ngữ + động từ + tân ngữ. Tính từ thường đứng trước danh từ hoặc sau be. Nếu có cả nơi chốn và thời gian, có thể đặt nơi chốn trước thời gian.',
    'I met my new neighbour at the supermarket yesterday.', 'Hôm qua tôi gặp hàng xóm mới ở siêu thị.', 'Khi lược tân ngữ bằng đại từ, dùng me/him/her/us/them thay cho I/he/she/we/they.',
    [
      ['My parents often visit ___ on Sundays.', 'us', 'we', 'our', 'Tân ngữ của visit là us.'],
      ['She bought a ___ for her room.', 'small desk', 'desk small', 'desk is small', 'Tính từ small đứng trước desk.'],
      ['I can see Lan, but she can’t see ___.', 'me', 'I', 'my', 'See cần đại từ tân ngữ me.'],
      ['The books on this shelf ___ old.', 'are', 'do', 'have', 'Dùng be + old để miêu tả.'],
      ['Complete the sentence with an object before the time. We ___ yesterday.', 'watched a film', 'a film watched', 'a film watching', 'Đặt watched trước tân ngữ a film.']
    ]),
  lesson('demonstratives', 'A1', 'Danh từ và mạo từ', 'This, that, these, those',
    'This và these chỉ người hoặc vật ở gần. That và those chỉ người hoặc vật ở xa. Dùng this/that với số ít và these/those với số nhiều.',
    'This book is mine, but those books on the top shelf belong to the library.', 'Cuốn này của tôi, nhưng những cuốn trên kệ cao kia thuộc thư viện.', 'These đi với books hoặc are. This đi với book hoặc is.',
    [
      ['___ shoes here are mine.', 'These', 'This', 'That', 'Shoes là số nhiều và here chỉ ở gần.'],
      ['Look at ___ tree across the road.', 'that', 'these', 'those', 'Một cây ở xa dùng that.'],
      ['___ is my seat, right here by the door.', 'This', 'These', 'Those', 'Một chỗ ngồi ở ngay đây dùng this.'],
      ['How much are ___ apples over there?', 'those', 'that', 'this', 'Apples số nhiều và over there ở xa.'],
      ['These ___ my house keys.', 'are', 'is', 'am', 'These là số nhiều và đi với are.']
    ]),
  lesson('requests', 'A1', 'Giao tiếp', 'Gọi món, hỏi giá và nhờ giúp',
    'Dùng I’d like + món hoặc to + hành động để nói mong muốn lịch sự. Could I...? để xin hoặc hỏi. How much is it? để hỏi giá một món.',
    'I’d like a cup of tea. Could I have the bill, please?', 'Tôi muốn một tách trà. Cho tôi xin hóa đơn được không?', 'I’d like là viết tắt của I would like. Sau would dùng like nguyên mẫu.',
    [
      ['I’d like ___ a table for two.', 'to book', 'booking', 'books', 'I’d like to + động từ diễn tả điều muốn làm.'],
      ['Could I ___ the menu, please?', 'see', 'seeing', 'to see', 'Sau could dùng see nguyên mẫu.'],
      ['___ is this notebook? — It’s three pounds.', 'How much', 'How many', 'How old', 'How much hỏi giá tiền.'],
      ['I’d like ___ coffee with milk, please.', 'a cup of', 'a cups of', 'a piece', 'A cup of là đơn vị quen dùng để gọi cà phê.'],
      ['You didn’t hear the price. Could you ___ that, please?', 'repeat', 'repeats', 'repeated', 'Dùng Could you repeat that? để nhờ nói lại.']
    ]),
  lesson('by-until', 'A2', 'Giới từ', 'By, until, within, before và after',
    'By nêu hạn chót hoàn tất. Until mô tả việc kéo dài đến một mốc. Within chỉ hoàn tất trong một khoảng thời gian cho phép. Before và after chỉ thứ tự.',
    'Send the form by Friday. The office stays open until six.', 'Gửi biểu mẫu muộn nhất vào thứ Sáu. Văn phòng mở đến sáu giờ.', 'By Friday có thể bao gồm thứ Sáu. Before Friday nghĩa là sớm hơn thứ Sáu.',
    [
      ['The report must be on my desk ___ noon at the latest.', 'by', 'until', 'during', 'At the latest xác định đây là hạn chót.'],
      ['She stayed at the hospital ___ her brother arrived.', 'until', 'within', 'for', 'Việc ở lại kéo dài tới lúc em trai đến.'],
      ['You will receive a reply ___ three working days.', 'within', 'since', 'until', 'Within three days nghĩa là không muộn hơn ba ngày sau.'],
      ['Turn the power off ___ cleaning the machine.', 'before', 'during of', 'since', 'Tắt điện trước khi vệ sinh.'],
      ['We had coffee ___ the meeting ended.', 'after', 'for', 'within', 'After + mệnh đề nêu sự kiện xảy ra trước.']
    ]),
  lesson('past-perfect-continuous', 'B1', 'Các thì', 'Quá khứ hoàn thành tiếp diễn',
    'Dùng had been + V-ing để nhấn quá trình đã diễn ra đến một mốc quá khứ khác. Dùng had + V3 nếu nhấn việc đã hoàn thành hoặc số lượng đã đạt.',
    'We had been walking for an hour when we reached the lake.', 'Chúng tôi đã đi bộ được một giờ thì đến hồ.', 'Nhìn từ mốc reached trong quá khứ, khoảng đi bộ xảy ra trước và kéo dài đến đó.',
    [
      ['I was tired because I ___ all morning.', 'had been working', 'had been work', 'have been working', 'Quá trình working kéo dài trước mốc was tired.'],
      ['He ___ for twenty minutes when the bus arrived.', 'had been waiting', 'has been waiting', 'had been waited', 'Bus arrived là điểm nhìn trong quá khứ.'],
      ['By eight that morning, she ___ both reports.', 'had finished', 'had been finish', 'has finished', 'Nhấn hai báo cáo đã hoàn thành trước tám giờ.'],
      ['How long ___ before the shop opened?', 'had you been waiting', 'you had been waiting', 'had you waiting', 'Đảo had, rồi dùng been waiting.'],
      ['It ___ heavily for hours before the match was cancelled.', 'had been raining', 'had been rain', 'has been raining', 'Nhấn thời gian mưa kéo dài trước quyết định hủy.']
    ]),
  lesson('future-continuous', 'B1', 'Các thì', 'Tương lai tiếp diễn',
    'Dùng will be + V-ing cho việc dự kiến đang diễn ra tại một điểm tương lai. Có thể dùng để hỏi lịch của người khác một cách trung tính.',
    'This time tomorrow, I will be flying to Hanoi.', 'Giờ này ngày mai tôi sẽ đang bay tới Hà Nội.', 'Will be working nhấn việc đang diễn ra tại mốc tương lai. Will work có thể nói quyết định hoặc dự đoán chung.',
    [
      ['At ten tomorrow, we ___ the new students.', 'will be welcoming', 'will welcoming', 'will be welcome', 'Mốc at ten nhìn vào hoạt động đang diễn ra.'],
      ['___ you be using the meeting room this afternoon?', 'Will', 'Are', 'Do', 'Câu hỏi tương lai tiếp diễn bắt đầu bằng will.'],
      ['Don’t call at six. I ___ home at that time.', 'will be driving', 'will be drive', 'will driving', 'At that time chỉ thời điểm đang lái xe.'],
      ['This time next week, the crew ___ equipment on site.', 'will be installing', 'will be install', 'has been installing', 'This time next week là mốc tương lai.'],
      ['They won’t ___ at noon because the kitchen is closed.', 'be cooking', 'be cook', 'cooking', 'Sau won’t cần be + V-ing.']
    ]),
  lesson('future-perfect', 'B1', 'Các thì', 'Tương lai hoàn thành và hoàn thành tiếp diễn',
    'Will have + V3 nhấn một kết quả hoàn tất trước mốc tương lai. Will have been + V-ing nhấn một quá trình kéo dài đến mốc đó. Hoàn thành tiếp diễn ít gặp hơn trong giao tiếp hằng ngày.',
    'By Friday, I will have finished the report. By June, I will have been working here for a year.', 'Đến thứ Sáu tôi sẽ hoàn thành báo cáo. Đến tháng Sáu tôi sẽ làm ở đây được một năm.', 'Kiểm tra xem câu nhấn đã xong bao nhiêu hay đã làm liên tục bao lâu.',
    [
      ['By next Friday, the builders ___ the roof.', 'will have repaired', 'will have repair', 'will having repaired', 'Will have repaired diễn tả mái đã sửa xong trước hạn.'],
      ['By July, she ___ here for ten years without a break.', 'will have been working', 'will have working', 'will been working', 'For ten years without a break nhấn quá trình.'],
      ['The team will have ___ the new software by noon.', 'installed', 'install', 'installing', 'Sau will have cần V3.'],
      ['By 2030, the council ___ at least 200 new homes.', 'will have built', 'will have build', 'will been built', 'Mốc 2030 dùng will have + V3 để nói số nhà hoàn thành.'],
      ['By midnight, I will have been ___ for twelve hours.', 'travelling', 'travelled', 'travel', 'Sau will have been cần V-ing để diễn tả quá trình.']
    ]),
  lesson('third-conditional', 'B1', 'Nối ý', 'Điều kiện loại 3 và could have',
    'Dùng if + had + V3 và would have + V3 để tưởng tượng kết quả khác cho một sự việc đã qua. Could have + V3 nói một khả năng đã không xảy ra trong ngữ cảnh này.',
    'If we had left earlier, we would have caught the train.', 'Nếu đi sớm hơn, chúng tôi đã kịp chuyến tàu.', 'Would have caught là kết quả. Had left là điều kiện trái với quá khứ.',
    [
      ['If I had checked the address, I ___ the right building.', 'would have found', 'will have found', 'would find', 'Kết quả giả định của một việc đã qua dùng would have + V3.'],
      ['We would have called if we ___ your number.', 'had known', 'have known', 'would know', 'If loại 3 dùng had + V3.'],
      ['She missed the bus. She could have ___ it if she had run.', 'caught', 'catch', 'catching', 'Could have đi với dạng V3 caught.'],
      ['If they ___ the map, they would not have got lost.', 'had brought', 'would have brought', 'will bring', 'Had brought đứng trong điều kiện.'],
      ['I would have helped if you ___ me.', 'had asked', 'ask', 'will ask', 'Điều kiện đã không xảy ra dùng had asked.']
    ]),
  lesson('everyday-chunks', 'A2', 'Giao tiếp', 'Cụm từ để trả lời và nêu lý do',
    'Trả lời câu hỏi bằng một ý ngắn, rồi thêm lý do hoặc ví dụ. Dùng I’d say để mở ý kiến, the main reason is that để nêu lý do và for example để dẫn tình huống.',
    'I’d say mornings work better for me. The main reason is that the house is quiet then.', 'Tôi thấy buổi sáng hợp với tôi hơn. Lý do chính là lúc đó nhà yên tĩnh.', 'Tập nói cả cụm I’d say và the main reason is that trước khi tự thay nửa câu còn lại.',
    [
      ['The main reason ___ I want to practise every day.', 'is that', 'is because of', 'that is', 'The main reason is that + mệnh đề.'],
      ['I’d definitely ___ the bus is more convenient.', 'say', 'saying', 'says', 'Would đi với say nguyên mẫu.'],
      ['I do short activities. For ___, I listen while washing the dishes.', 'example', 'reason', 'although', 'For example mở một ví dụ cụ thể.'],
      ['It depends ___ how much time I have.', 'on', 'of', 'at', 'Cụm dùng trong trả lời là it depends on.'],
      ['I enjoy walking. It’s much ___ convenient than driving here.', 'more', 'most', 'many', 'Much có thể nhấn mạnh so sánh hơn more convenient.']
    ])
]
