import { lesson } from '../foundations.ts'

export const b1 = [
  lesson('perfect-continuous', 'B1', 'Các thì', 'Hiện tại hoàn thành tiếp diễn',
    'Dùng have/has been + V-ing khi nhấn quá trình kéo dài đến hiện tại hoặc vừa dừng và để lại dấu vết. Dùng hiện tại hoàn thành đơn nếu nhấn kết quả hoặc số lượng hoàn tất.',
    'I’ve been writing all afternoon, and I’ve finished two pages.', 'Tôi viết suốt buổi chiều và đã hoàn thành hai trang.', 'Know và own thường hợp với hoàn thành đơn khi mô tả trạng thái kéo dài.',
    [
      ['Her hands are dirty because she ___ in the garden.', 'has been working', 'has been work', 'have been working', 'Dấu hiệu hiện tại cho thấy quá trình vừa diễn ra.'],
      ['I ___ three chapters so far.', 'have finished', 'have been finish', 'has finished', 'Nhấn số chương hoàn tất.'],
      ['They ___ for the bus since 7:30.', 'have been waiting', 'are waited', 'has been waiting', 'Một việc kéo dài liên tục từ mốc 7:30.'],
      ['We ___ each other for ten years.', 'have known', 'have been knew', 'have been knowing', 'Know chỉ trạng thái, dùng have known.'],
      ['How long ___ on this report?', 'have you been working', 'have you been work', 'you have been working', 'Đảo have trước you và giữ been + working.']
    ]),
  lesson('past-perfect', 'B1', 'Các thì', 'Quá khứ hoàn thành',
    'Dùng had + V3 cho việc xảy ra trước một mốc quá khứ khác khi thứ tự cần làm rõ. Việc sau thường dùng quá khứ đơn.',
    'By the time I arrived, the meeting had already started.', 'Khi tôi tới thì cuộc họp đã bắt đầu rồi.', 'Nếu các hành động được kể theo thứ tự rõ bằng then, quá khứ đơn thường đủ.',
    [
      ['When I got to the station, the train ___ already ___.', 'had / left', 'has / left', 'had / leave', 'Tàu rời ga trước lúc người nói tới.'],
      ['I recognised him because we ___ before.', 'had met', 'had meet', 'have met', 'Cuộc gặp trước thời điểm nhận ra đã qua.'],
      ['She couldn’t open the room because she ___ the key at home.', 'had left', 'has left', 'had leave', 'Bỏ chìa khóa xảy ra trước lúc không mở cửa được.'],
      ['By the time we called, the office ___.', 'had closed', 'has closed', 'had close', 'Had + V3 diễn tả sự kiện đã hoàn tất trước lúc gọi.'],
      ['We ___ breakfast and then went for a walk.', 'had', 'have', 'having', 'Then làm thứ tự rõ. Had là quá khứ đơn của have.']
    ]),
  lesson('passives', 'B1', 'Dựng câu', 'Câu bị động',
    'Dùng be + V3 khi đối tượng chịu tác động là trọng tâm. Chia be theo thì và chủ ngữ. Có thể thêm by + tác nhân khi cần nêu ai thực hiện.',
    'The bridge was built in 1998 and is inspected every year.', 'Cây cầu được xây năm 1998 và được kiểm tra mỗi năm.', 'Bản thân V3 không mang thì. Đổi is inspected thành was inspected khi nói lần kiểm tra đã qua.',
    [
      ['The parcels ___ every morning.', 'are collected', 'collects', 'is collected', 'Parcels là đối tượng được thu gom và là số nhiều.'],
      ['The hall ___ last year.', 'was renovated', 'is renovating', 'has renovated', 'Quá khứ bị động với last year dùng was + V3.'],
      ['The final results will ___ next week.', 'be announced', 'announced', 'be announce', 'Bị động sau will dùng be + V3.'],
      ['The results have already ___ online.', 'been published', 'published', 'being publish', 'Hiện tại hoàn thành bị động là have been + V3.'],
      ['The painting was donated ___ a local family.', 'by', 'at', 'of', 'By giới thiệu người thực hiện hành động.']
    ]),
  lesson('conditionals', 'B1', 'Nối ý', 'Câu điều kiện 0, 1 và 2',
    'Loại 0 nói quy luật, dùng hiện tại ở hai mệnh đề. Loại 1 nói khả năng có thật ở tương lai, if + hiện tại rồi will + V. Loại 2 nói giả định, if + quá khứ rồi would + V.',
    'If I finish early, I’ll call you. If I had more time, I would learn another language.', 'Nếu xong sớm tôi sẽ gọi. Nếu có nhiều thời gian hơn, tôi sẽ học thêm một ngôn ngữ.', 'Trong cấu trúc loại 1 thông thường, đặt will ở mệnh đề kết quả.',
    [
      ['If water reaches 0°C in these conditions, it ___.', 'freezes', 'would freezes', 'freeze', 'Quy luật chung dùng hiện tại đơn.'],
      ['If it rains tomorrow, we ___ indoors.', 'will stay', 'would stayed', 'staying', 'Khả năng tương lai dùng will + stay ở kết quả.'],
      ['If I had a bigger room, I ___ a desk by the window.', 'would put', 'will puts', 'putting', 'Giả định ở hiện tại dùng would + V.'],
      ['I’ll send you the link if she ___ it to me.', 'gives', 'will give', 'give', 'Trong if loại 1, she đi với gives.'],
      ['If I ___ you, I would ask for feedback.', 'were', 'am', 'will be', 'If I were you là mẫu lời khuyên bằng giả định.']
    ]),
  lesson('relative-clauses', 'B1', 'Nối ý', 'Mệnh đề quan hệ who, which, that, where',
    'Who thay người, which thay vật, that thay người hoặc vật trong mệnh đề xác định. Where chỉ nơi diễn ra việc. Mệnh đề bổ sung đặt sau dấu phẩy dùng who/which trong các trường hợp này.',
    'The café where we met is closing. My old school, which opened in 1980, is nearby.', 'Quán cà phê nơi chúng tôi gặp nhau sắp đóng. Trường cũ của tôi, mở năm 1980, ở gần đó.', 'Có thể bỏ đại từ khi nó là tân ngữ trong mệnh đề xác định, như the book (that) I bought.',
    [
      ['The woman ___ teaches this class is from Leeds.', 'who', 'where', 'which', 'Đại từ thay người làm chủ ngữ của teaches.'],
      ['This is the room ___ the interviews took place.', 'where', 'who', 'whose', 'Where thay cho in this room.'],
      ['The bus, ___ was already full, stopped outside.', 'which', 'that', 'who', 'Mệnh đề bổ sung sau dấu phẩy chỉ một vật dùng which.'],
      ['I found the bag ___ you left at my house.', 'that', 'who', 'where', 'That thay bag làm tân ngữ của left.'],
      ['I met the student ___ laptop was stolen.', 'whose', 'who', 'which', 'Whose cho biết laptop thuộc về student.']
    ]),
  lesson('reported-speech', 'B1', 'Dựng câu', 'Câu tường thuật',
    'Khi thuật lại lời nói đã qua, thường đổi đại từ và lùi thì nếu ngữ cảnh thời gian đã thay đổi. Say có thể đứng trực tiếp trước that. Tell thường cần người nghe.',
    'Lin said that she would call the next day.', 'Lin nói cô ấy sẽ gọi vào ngày hôm sau.', 'Câu hỏi gián tiếp trở về trật tự chủ ngữ + động từ, như asked where I lived.',
    [
      ['On Monday, he said, “I am tired.” Later I said: He said that he ___ tired.', 'was', 'were', 'am', 'Lùi am về was khi thuật lại trạng thái hôm đó.'],
      ['She ___ me that she had finished.', 'told', 'said', 'told to', 'Told me dùng trực tiếp với người nghe.'],
      ['He asked me where ___.', 'I lived', 'did I live', 'lived I', 'Câu hỏi tường thuật đặt I trước lived.'],
      ['Yesterday she promised, “I will call you.” She said she ___ call me.', 'would', 'will to', 'has to', 'Will thường chuyển thành would khi lùi thì.'],
      ['“Please sit down.” She asked us ___ down.', 'to sit', 'sitting', 'sit', 'Ask + người nghe + to V để thuật lại lời yêu cầu.']
    ]),
  lesson('cohesion', 'B1', 'Nối ý', 'However, therefore, despite và in addition',
    'However báo hiệu sự tương phản giữa hai ý độc lập. Therefore báo hiệu kết quả. In addition thêm ý. Despite đi với danh từ hoặc V-ing, while/although đi với mệnh đề.',
    'The fee rose. However, enrolment remained stable.', 'Học phí tăng. Tuy nhiên, số người đăng ký vẫn ổn định.', 'Dùng dấu chấm trước However nếu cả hai vế là câu độc lập. Despite không đứng trực tiếp trước một mệnh đề hoàn chỉnh.',
    [
      ['___ the heavy rain, the event went ahead.', 'Despite', 'Although', 'Therefore', 'The heavy rain là cụm danh từ đi sau despite.'],
      ['The floor was wet. ___, the manager closed the room.', 'Therefore', 'Although', 'Despite', 'Đóng phòng là kết quả của sàn ướt.'],
      ['The scheme is costly. ___, it could save energy in the long term.', 'However', 'Therefore', 'Because', 'Ý sau tương phản với chi phí.'],
      ['The centre offers free classes. ___, it lends laptops.', 'In addition', 'Despite', 'Although', 'In addition giới thiệu tiện ích bổ sung.'],
      ['___ the route was long, we arrived on time.', 'Although', 'Despite', 'Therefore', 'The route was long là mệnh đề, dùng although.']
    ]),
  lesson('agreement', 'B1', 'Dựng câu', 'Hòa hợp chủ ngữ và động từ',
    'Tìm danh từ chính làm chủ ngữ rồi chọn động từ. Each và every thường dùng động từ số ít. The number of thường theo số ít, còn a number of theo số nhiều.',
    'The price of the tickets has increased.', 'Giá vé đã tăng.', 'Trong the price of the tickets, price quyết định has. Tickets nằm trong cụm of.',
    [
      ['Each of the rooms ___ a window.', 'has', 'have', 'are having', 'Each là chủ ngữ số ít.'],
      ['The cost of these repairs ___ quite high.', 'is', 'are', 'be', 'Danh từ chính là cost.'],
      ['A number of students ___ requested more time.', 'have', 'has', 'is', 'A number of students diễn tả một số sinh viên.'],
      ['The number of applicants ___ doubled.', 'has', 'have', 'are', 'The number nói về một con số.'],
      ['Every applicant ___ to sign the form.', 'needs', 'need', 'are needing', 'Every applicant được xem là số ít.']
    ]),
  lesson('dependent-nouns', 'B1', 'Giới từ', 'Giới từ trong cụm danh từ học thuật',
    'Ghi nhớ giới từ cùng với danh từ và nghĩa cụ thể, như an increase in prices, a reason for a decision, a solution to a problem, an effect on health.',
    'The report examines the effect of noise on sleep.', 'Báo cáo xem xét ảnh hưởng của tiếng ồn đối với giấc ngủ.', 'Increase in nói thứ gì tăng. Increase of nói mức tăng, như an increase of five points.',
    [
      ['There was an increase ___ demand for buses.', 'in', 'on', 'to', 'Increase in + thứ đã tăng.'],
      ['The new route had a positive effect ___ travel times.', 'on', 'at', 'in', 'Effect on nêu điều chịu ảnh hưởng.'],
      ['We need a solution ___ this problem.', 'to', 'on', 'at', 'Solution to + vấn đề.'],
      ['Could you explain the reason ___ your decision?', 'for', 'at', 'with', 'Reason for nêu điều cần giải thích.'],
      ['The survey found an increase ___ 12 percentage points.', 'of', 'in', 'on', 'Increase of + độ lớn của mức tăng.']
    ]),
  lesson('articles-academic', 'B1', 'Danh từ và mạo từ', 'Mạo từ trong đoạn văn học thuật',
    'Dùng a/an để giới thiệu một đối tượng. Dùng the khi cụm sau hoặc câu trước giúp nhận diện đối tượng. Danh từ số nhiều và không đếm được thường bỏ mạo từ khi nói về cả nhóm hoặc khái niệm nói chung.',
    'Education affects employment. The education provided by this college is mainly vocational.', 'Giáo dục ảnh hưởng việc làm. Chương trình giáo dục tại trường này chủ yếu mang tính nghề nghiệp.', 'Mạo từ thay đổi theo nghĩa. Technology có thể là công nghệ nói chung, còn a technology là một phương pháp hoặc hệ thống cụ thể.',
    [
      ['___ public transport can reduce reliance on private cars.', 'Ø', 'A', 'An', 'Public transport được dùng với nghĩa chung và không đếm được.'],
      ['The chart shows ___ proportion of households surveyed that own a car.', 'the', 'a', 'Ø', 'Phần mô tả sau xác định đúng tỉ lệ được nói đến.'],
      ['The team tested a new material. ___ material was lighter than steel.', 'The', 'A', 'Ø', 'Material đã được giới thiệu trước.'],
      ['Making this change would be ___ effective way to reduce waste.', 'an', 'a', 'Ø', 'Way đếm được số ít và effective bắt đầu bằng âm nguyên âm.'],
      ['___ renewable sources such as wind and sunlight can help generate electricity.', 'Ø', 'A', 'An', 'Renewable sources là số nhiều mang nghĩa chung.']
    ]),
  lesson('noun-verb-forms', 'B1', 'Mô tả', 'Danh từ, động từ và tính từ cùng họ',
    'Chọn dạng theo vị trí trong câu. Sau a/an hoặc tính từ thường cần danh từ. Sau chủ ngữ có thể cần động từ chính. Trước danh từ có thể cần tính từ. Hậu tố là gợi ý, hãy kiểm tra nghĩa.',
    'The town developed rapidly. Its rapid development created new jobs.', 'Thị trấn phát triển nhanh. Sự phát triển nhanh đó tạo thêm việc làm.', 'Economic nói về kinh tế. Economical nhấn sự tiết kiệm.',
    [
      ['The rapid ___ of the town attracted new businesses.', 'development', 'develop', 'developed', 'Sau the rapid dùng danh từ development.'],
      ['The policy could ___ traffic during peak hours.', 'reduce', 'reduction', 'reduced', 'Sau could dùng động từ nguyên mẫu.'],
      ['The company has seen a ___ improvement in service.', 'significant', 'significantly', 'significance', 'Bổ nghĩa cho improvement cần tính từ.'],
      ['Water use declined ___ in July.', 'sharply', 'sharp', 'sharpness', 'Sharply bổ nghĩa cho động từ declined.'],
      ['This stove is ___ to run because it uses less fuel.', 'economical', 'economics', 'economically', 'Economical mô tả tính tiết kiệm nhiên liệu.']
    ]),
  lesson('used-to', 'B1', 'Các thì', 'Used to, be used to và get used to',
    'Used to + V mô tả thói quen hoặc trạng thái đã thay đổi. Be used to + danh từ/V-ing nói đã quen. Get used to nói quá trình thích nghi.',
    'I used to drive, but now I am used to taking the bus.', 'Trước đây tôi hay lái xe, giờ tôi đã quen đi xe buýt.', 'Sau did, dùng use to. Sau be used to, chữ to là giới từ.',
    [
      ['I ___ live near the sea, but now I live inland.', 'used to', 'am used to', 'get used', 'Used to + live chỉ tình trạng quá khứ đã thay đổi.'],
      ['She is used to ___ early.', 'getting up', 'get up', 'got up', 'Sau be used to dùng V-ing.'],
      ['It took us a month to ___ the noise.', 'get used to', 'used to', 'getting used', 'Get used to mô tả thời gian để thích nghi.'],
      ['Did you ___ walk to school?', 'use to', 'used to', 'be used', 'Did đã thể hiện quá khứ, dùng use to.'],
      ['Night shifts feel normal now. I ___ working at night.', 'am used to', 'used to', 'used', 'Đã quen hiện tại, dùng am used to + V-ing.']
    ])
]
