import { lesson } from '../foundations.ts'

export const a1 = [
  lesson('be-subjects', 'A1', 'Dựng câu', 'Chủ ngữ và động từ be',
    'Dùng I am, he/she/it is, và you/we/they are để nói ai là ai, ở đâu hoặc đang thế nào. Phủ định đặt not ngay sau be. Câu hỏi đưa be lên trước chủ ngữ.',
    'My sister is at home, but I am at work.', 'Chị tôi ở nhà, còn tôi đang ở chỗ làm.', 'Trong tiếng Anh, câu “Tôi mệt” cần cả chủ ngữ lẫn be. Nói I am tired.',
    [
      ['I ___ from Viet Nam.', 'am', 'is', 'are', 'Chủ ngữ I đi với am.'],
      ['Mina and Ben ___ ready.', 'are', 'is', 'am', 'Hai người là số nhiều, tương đương they.'],
      ['___ your phone on the desk?', 'Is', 'Are', 'Am', 'Your phone là một vật. Đưa is lên đầu câu hỏi.'],
      ['These bags ___ mine.', 'are not', 'not are', 'is not', 'These bags là số nhiều. Đặt not sau are.'],
      ['My parents are teachers. ___ work in the same school.', 'They', 'She', 'It', 'Dùng they để thay cho my parents.'],
      ['It ___ cold this morning.', 'is', 'are', 'am', 'It làm chủ ngữ và đi với is.']
    ]),
  lesson('articles-indefinite', 'A1', 'Danh từ và mạo từ', 'Mạo từ a/an',
    'Dùng a hoặc an trước danh từ đếm được số ít khi giới thiệu một người hay vật chưa xác định. Chọn theo âm đầu của phần đứng sau mạo từ. An đứng trước âm nguyên âm.',
    'She is an engineer at a university.', 'Cô ấy là kỹ sư tại một trường đại học.', 'University bắt đầu bằng âm /j/. Hour có h câm nên bắt đầu bằng âm nguyên âm.',
    [
      ['I bought ___ umbrella because it was raining.', 'an', 'a', 'Ø', 'Umbrella bắt đầu bằng âm /ʌ/.'],
      ['It takes ___ hour to get there.', 'an', 'a', 'Ø', 'H trong hour không được phát âm.'],
      ['He studies at ___ university in Huế.', 'a', 'an', 'Ø', 'University mở đầu bằng âm /j/.'],
      ['I have ___ new laptop.', 'a', 'an', 'Ø', 'Từ đứng ngay sau mạo từ là new, bắt đầu bằng /n/.'],
      ['She wants to become ___ architect.', 'an', 'a', 'Ø', 'Architect là nghề nghiệp đếm được số ít và bắt đầu bằng âm nguyên âm.'],
      ['We need ___ useful guide for the tour.', 'a', 'an', 'Ø', 'Useful bắt đầu bằng /j/, một âm phụ âm.']
    ]),
  lesson('articles-definite', 'A1', 'Danh từ và mạo từ', 'The hay bỏ mạo từ?',
    'Dùng the khi người nghe biết bạn nói vật nào, nhờ ngữ cảnh, lần nhắc trước hoặc phần mô tả xác định. Khi nói chung về danh từ số nhiều, danh từ không đếm được hoặc ngôn ngữ, thường dùng Ø.',
    'I saw a dog. The dog was sitting by the gate.', 'Tôi thấy một con chó. Con chó đó ngồi cạnh cổng.', 'Books are useful nói chung về sách. The books on the table chỉ nhóm sách cụ thể.',
    [
      ['I bought a pen and a notebook. ___ pen is blue.', 'The', 'A', 'Ø', 'Pen đã được giới thiệu ở câu trước.'],
      ['___ water is necessary for life.', 'Ø', 'A', 'The', 'Water được dùng theo nghĩa chung.'],
      ['Can you pass ___ salt on the table?', 'the', 'a', 'Ø', 'Cụm on the table chỉ rõ lọ muối nào.'],
      ['___ students often need time to adjust to university life.', 'Ø', 'A', 'The', 'Students ở đây chỉ sinh viên nói chung.'],
      ['My cousin speaks ___ English at work.', 'Ø', 'the', 'an', 'Tên ngôn ngữ thường không có mạo từ.'],
      ['___ moon looks very bright tonight.', 'The', 'A', 'Ø', 'Người nói và người nghe cùng biết mặt trăng nào.']
    ]),
  lesson('plurals', 'A1', 'Danh từ và mạo từ', 'Số nhiều và danh từ đếm được',
    'Phần lớn danh từ thêm -s hoặc -es. Một số đổi dạng như child → children và person → people. Với danh từ không đếm được như advice, information và furniture, dùng đơn vị như a piece of.',
    'I found two chairs and a piece of useful information.', 'Tôi tìm thấy hai chiếc ghế và một thông tin hữu ích.', 'Information và advice thường không có dạng số nhiều trong cách dùng này.',
    [
      ['Two ___ are waiting outside.', 'children', 'childs', 'child', 'Children là số nhiều bất quy tắc của child.'],
      ['Could you give me some ___?', 'advice', 'advices', 'an advice', 'Advice không đếm được. Some advice là tự nhiên.'],
      ['I bought three ___ of milk.', 'bottles', 'bottle', 'milks', 'Bottle là đơn vị đếm và cần số nhiều sau three.'],
      ['There are five ___ on this bus.', 'people', 'person', 'peoples', 'People là số nhiều thông dụng của person khi nói về các cá nhân.'],
      ['The hotel provides useful ___ about local buses.', 'information', 'informations', 'an information', 'Information là danh từ không đếm được.'],
      ['The building has six ___.', 'offices', 'office', 'officees', 'Office kết thúc bằng e, thêm s thành offices.']
    ]),
  lesson('time-prepositions', 'A1', 'Giới từ', 'Giới từ thời gian in/on/at',
    'Dùng at với giờ và một số cụm cố định như at night. Dùng on với ngày hoặc ngày cụ thể, kể cả on Monday morning. Dùng in với tháng, năm, mùa và buổi nói chung.',
    'The class starts at nine on Monday in September.', 'Lớp bắt đầu lúc chín giờ vào thứ Hai trong tháng Chín.', 'Với next Monday, last year và every morning, thường không cần in, on, at.',
    [
      ['The doctor can see you ___ 10:30.', 'at', 'on', 'in', '10:30 là giờ cụ thể.'],
      ['We have a test ___ Friday afternoon.', 'on', 'in', 'at', 'Friday afternoon là buổi của một ngày cụ thể.'],
      ['My sister was born ___ 2004.', 'in', 'on', 'at', 'In đi với năm.'],
      ['The streets get quieter ___ night.', 'at', 'on', 'in', 'At night là cụm cố định chỉ ban đêm nói chung.'],
      ['I am usually free ___ the evening.', 'in', 'on', 'at', 'In the evening nói về một buổi nói chung.'],
      ['The next lesson is ___ next Tuesday.', 'Ø', 'on', 'in', 'Next Tuesday đã xác định thời gian, dùng trực tiếp.']
    ]),
  lesson('place-prepositions', 'A1', 'Giới từ', 'Giới từ vị trí in/on/at',
    'Dùng in khi nhấn bên trong, on khi vật nằm trên bề mặt, và at khi xem nơi chốn như một điểm gặp hoặc địa điểm. Cách nhìn phụ thuộc ý muốn nói.',
    'Let’s meet at the station, near the shop inside the building.', 'Hẹn gặp ở nhà ga, gần cửa hàng bên trong tòa nhà.', 'At the door là ở chỗ cửa. On the door là một vật gắn trên bề mặt cửa.',
    [
      ['There is a note stuck ___ the door.', 'on', 'in', 'at', 'Tờ giấy dán trên bề mặt cửa.'],
      ['The keys are ___ my bag.', 'in', 'on', 'at', 'Chìa khóa nằm trong túi.'],
      ['I will wait ___ the main entrance.', 'at', 'in', 'on', 'Lối vào là điểm hẹn.'],
      ['She lives ___ a small town near the coast.', 'in', 'on', 'at', 'Thị trấn được nhìn như một khu vực chứa nơi ở.'],
      ['The sign is flat against the wall, so it is ___ the wall.', 'on', 'at', 'in', 'Biển hiệu gắn trên bề mặt tường.'],
      ['The water stayed ___ the sealed bottle.', 'in', 'on', 'at', 'Nước ở bên trong chai đã đóng kín.']
    ]),
  lesson('movement-prepositions', 'A1', 'Giới từ', 'Giới từ chỉ di chuyển',
    'To chỉ đích đến, from chỉ điểm bắt đầu, into chỉ chuyển động từ ngoài vào trong. Across đi từ bên này sang bên kia một bề mặt. Through đi xuyên qua một không gian.',
    'We walked across the bridge and into the library.', 'Chúng tôi đi qua cầu rồi bước vào thư viện.', 'Go home thường không có to. Để nói đi tới nhà của ai thì dùng go to someone’s house.',
    [
      ['The train runs ___ Đà Nẵng to Huế.', 'from', 'into', 'across', 'From...to... nêu điểm đầu và điểm đến.'],
      ['She stepped ___ the classroom and closed the door.', 'into', 'across', 'from', 'Cô ấy bước từ ngoài vào trong lớp.'],
      ['Look both ways before you walk ___ the road.', 'across', 'through', 'from', 'Across chỉ di chuyển từ bên này đường sang bên kia.'],
      ['We travelled ___ a long tunnel under the river.', 'through', 'across', 'from', 'Through dùng khi đi xuyên qua bên trong đường hầm.'],
      ['We went ___ home after the concert.', 'Ø', 'to', 'at', 'Home làm trạng từ chỉ đích đến trong go home.'],
      ['Where is this bus going? It goes ___ the airport.', 'to', 'from', 'into', 'Trong ngữ cảnh hỏi điểm đến, to the airport nghĩa là xe đi đến sân bay.']
    ]),
  lesson('present-simple', 'A1', 'Các thì', 'Hiện tại đơn',
    'Dùng hiện tại đơn cho thói quen hoặc sự thật. Thêm -s/-es sau he, she, it. Dùng do/does trong câu hỏi và don’t/doesn’t trong phủ định, sau đó dùng động từ nguyên mẫu.',
    'She takes the bus every morning, but she doesn’t drive.', 'Sáng nào cô ấy cũng đi xe buýt, và cô ấy không lái xe.', 'Sau does hoặc doesn’t, động từ chính không thêm -s.',
    [
      ['He ___ at a café on Saturdays.', 'works', 'work', 'is work', 'He là ngôi thứ ba số ít, động từ thêm s.'],
      ['Does Lan ___ near the school?', 'live', 'lives', 'living', 'Sau does dùng live nguyên mẫu.'],
      ['My parents ___ coffee after dinner.', 'don’t drink', 'doesn’t drink', 'don’t drinks', 'My parents là số nhiều, dùng don’t + drink.'],
      ['Water ___ at about 100°C at sea level.', 'boils', 'boil', 'is boil', 'Sự thật chung với chủ ngữ water dùng boils.'],
      ['___ you take the train every day?', 'Do', 'Does', 'Are', 'Câu hỏi về thói quen với you dùng do.'],
      ['The museum usually ___ at six.', 'closes', 'close', 'closing', 'The museum tương đương it.']
    ]),
  lesson('present-continuous', 'A1', 'Các thì', 'Hiện tại tiếp diễn',
    'Dùng am/is/are + V-ing cho việc đang xảy ra hoặc tình trạng tạm thời. Trong câu hỏi, đưa am/is/are lên trước chủ ngữ.',
    'I am staying with my aunt this week.', 'Tuần này tôi đang ở nhờ nhà dì.', 'Know, need và own thường chỉ trạng thái nên dùng hiện tại đơn trong nghĩa thông thường.',
    [
      ['Be quiet. The baby ___.', 'is sleeping', 'is sleep', 'are sleeping', 'Việc đang xảy ra với baby dùng is + sleeping.'],
      ['I ___ for the bus right now.', 'am waiting', 'is waiting', 'am wait', 'I đi với am và động từ thêm -ing.'],
      ['They ___ the gym this week because it is closed.', 'aren’t using', 'isn’t using', 'aren’t use', 'They đi với are. Phủ định là aren’t + using.'],
      ['___ your brothers studying at the moment?', 'Are', 'Is', 'Do', 'Brothers là số nhiều. Đảo are để hỏi.'],
      ['I ___ the answer, so I can explain it.', 'know', 'am knowing', 'am know', 'Know ở đây mô tả trạng thái biết.'],
      ['Look at the sky. It ___.', 'is getting darker', 'gets darkest', 'is get darker', 'Getting diễn tả sự thay đổi đang diễn ra.']
    ]),
  lesson('past-simple', 'A1', 'Các thì', 'Quá khứ đơn',
    'Dùng cho việc đã kết thúc tại một thời điểm quá khứ. Động từ thường thêm -ed. Động từ bất quy tắc đổi dạng. Sau did và didn’t, dùng nguyên mẫu.',
    'We went to the market yesterday, but we didn’t buy anything.', 'Hôm qua chúng tôi đi chợ nhưng không mua gì.', 'Did you go? dùng go, vì did đã mang dấu quá khứ.',
    [
      ['We ___ the science museum yesterday.', 'visited', 'visit', 'have visited', 'Yesterday là thời điểm quá khứ đã kết thúc.'],
      ['I ___ your message last night.', 'read', 'readed', 'have read', 'Dạng quá khứ của read viết giống V1, phát âm /red/.'],
      ['Did you ___ the door?', 'lock', 'locked', 'locking', 'Dùng động từ nguyên mẫu sau did.'],
      ['The bus ___ on time, so I walked.', 'didn’t arrive', 'didn’t arrived', 'doesn’t arrived', 'Didn’t đi với arrive nguyên mẫu.'],
      ['My friends ___ at home last night.', 'were', 'was', 'are', 'Chủ ngữ số nhiều đi với were ở quá khứ.'],
      ['She ___ a new bike two days ago.', 'bought', 'buyed', 'has bought', 'Bought là dạng quá khứ của buy. Ago gắn với thời điểm đã qua.']
    ]),
  lesson('questions', 'A1', 'Dựng câu', 'Câu hỏi Who, Where, When, Why, How',
    'Câu hỏi thông tin thường theo mẫu từ hỏi + trợ động từ + chủ ngữ + động từ. Khi who hỏi chính chủ ngữ, dạng đơn giản không cần do/does/did.',
    'Where does your sister work? Who lives next door?', 'Chị bạn làm ở đâu? Ai sống nhà bên cạnh?', 'How long hỏi thời lượng. How often hỏi tần suất.',
    [
      ['___ do you live? — In Hà Nội.', 'Where', 'When', 'Who', 'Câu trả lời là một nơi chốn.'],
      ['___ does your lesson end? — At four.', 'When', 'Where', 'Which person', 'At four trả lời về thời gian.'],
      ['___ helps you with English? — My brother.', 'Who', 'Where', 'How long', 'Who hỏi về chủ ngữ thực hiện việc giúp.'],
      ['___ do you go running? — Twice a week.', 'How often', 'How long', 'How much', 'Twice a week trả lời về tần suất.'],
      ['___ is she upset? — Because she missed the bus.', 'Why', 'When', 'How long', 'Because mở đầu lý do.'],
      ['Where ___ your brother study?', 'does', 'do', 'is', 'Brother là ngôi thứ ba số ít. Dùng does trước chủ ngữ.']
    ]),
  lesson('possessives', 'A1', 'Danh từ và mạo từ', 'My, mine và sở hữu cách',
    'My/your/his/her/our/their đứng trước danh từ. Mine/yours/his/hers/ours/theirs thay cả cụm danh từ. Dùng ’s với một người hoặc tên riêng để chỉ sở hữu.',
    'This is my bag. The blue one is yours.', 'Đây là túi của tôi. Cái màu xanh là của bạn.', 'Its chỉ sở hữu, còn it’s là cách viết tắt của it is hoặc it has.',
    [
      ['Is this ___ notebook, Mai?', 'your', 'yours', 'you', 'Notebook cần từ chỉ sở hữu đứng trước danh từ.'],
      ['That bag is ___. I bought it yesterday.', 'mine', 'my', 'me', 'Mine thay cho my bag.'],
      ['This is ___ bicycle.', 'Lan’s', 'Lans', 'Lan is', 'Lan’s đứng trước bicycle để chỉ đồ của Lan.'],
      ['The dog hurt ___ leg.', 'its', 'it’s', 'it', 'Its chỉ phần chân thuộc về con chó.'],
      ['They live with ___ grandparents.', 'their', 'theirs', 'them', 'Their đứng trước danh từ grandparents.'],
      ['The red umbrellas belong to our neighbours. They are ___.', 'theirs', 'their', 'them', 'Theirs thay cho their umbrellas.']
    ]),
  lesson('there-quantifiers', 'A1', 'Dựng câu', 'There is/are và some/any',
    'Dùng there is với danh từ số ít hoặc không đếm được và there are với danh từ số nhiều. Some thường dùng trong câu khẳng định, any thường gặp trong câu hỏi và phủ định. Lời mời có thể dùng some.',
    'There are some eggs, but there isn’t any milk.', 'Có vài quả trứng, nhưng không có sữa.', 'Are there...? hỏi sự tồn tại của nhiều thứ, khác với Where are...? hỏi vị trí.',
    [
      ['There ___ a small park near my house.', 'is', 'are', 'am', 'A small park là số ít.'],
      ['Are there ___ apples left?', 'any', 'a', 'an', 'Any phù hợp trong câu hỏi trung tính về danh từ số nhiều.'],
      ['There ___ two cafés on this street.', 'are', 'is', 'am', 'Two cafés là số nhiều.'],
      ['There isn’t ___ sugar in the cupboard.', 'any', 'many', 'a', 'Sugar không đếm được và câu đang phủ định.'],
      ['Would you like ___ tea?', 'some', 'many', 'a few', 'Lời mời dùng some với danh từ không đếm được.'],
      ['There ___ water on the floor.', 'is', 'are', 'be', 'Water là danh từ không đếm được, dùng is.']
    ])
]
