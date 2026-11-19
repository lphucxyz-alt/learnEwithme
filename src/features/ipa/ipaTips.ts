export interface IpaViTip {
  vs?: string
  cue: string
  trap: string
  pair?: [string, string]
}

const IPA_VI_TIPS: Record<string, IpaViTip> = {
  'θ': {
    vs: '/s/ hoặc /t/',
    cue: 'Đặt nhẹ đầu lưỡi kẹp giữa hai hàm răng cửa, thổi hơi ra êm như xì gió, cổ họng không rung.',
    trap: 'Hay đọc thành chữ "th" tiếng Việt (như "thỏ") hoặc trượt thành "s" (sink thay vì think).',
    pair: ['think /θɪŋk/', 'sink /sɪŋk/'],
  },
  'ð': {
    vs: '/d/ hoặc /z/',
    cue: 'Vị trí lưỡi giống hệt âm /θ/, nhưng bật giọng để dây thanh ở cổ họng rung lên rõ rệt.',
    trap: 'Hay đọc cứng thành "đ" tiếng Việt (đây, đát) thay vì để lưỡi chạm răng.',
    pair: ['they /ðeɪ/', 'day /deɪ/'],
  },
  'iː': {
    vs: '/ɪ/',
    cue: 'Kéo khóe miệng sang hai bên như đang cười mỉm, giữ âm "i" căng và kéo dài gấp đôi bình thường.',
    trap: 'Đọc quá ngắn khiến "sheep" (con cừu) nghe thành "ship" (con tàu).',
    pair: ['sheep /ʃiːp/', 'ship /ʃɪp/'],
  },
  'ɪ': {
    vs: '/iː/',
    cue: 'Thả lỏng môi hoàn toàn, phát ra âm ngắn nằm giữa "i" và "ê" trong tiếng Việt, dứt khoát.',
    trap: 'Đọc thành chữ "i" căng của tiếng Việt làm mất độ tự nhiên.',
    pair: ['live /lɪv/', 'leave /liːv/'],
  },
  'æ': {
    vs: '/e/',
    cue: 'Hạ hàm dưới xuống sâu như sắp đọc chữ "a", nhưng ép miệng rộng ngang để phát ra âm pha giữa "a" và "e".',
    trap: 'Hạ hàm không đủ sâu khiến "bad" nghe giống hệt "bed".',
    pair: ['bad /bæd/', 'bed /bed/'],
  },
  'e': {
    vs: '/æ/',
    cue: 'Mở miệng vừa phải, thả lỏng hàm và đọc gọn như chữ "e" tiếng Việt nhưng ngắn hơn.',
    trap: 'Kéo dài âm quá mức hoặc há quá to sang âm /æ/.',
    pair: ['men /men/', 'man /mæn/'],
  },
  'ʃ': {
    vs: '/s/',
    cue: 'Chu tròn môi ra phía trước như khi ra hiệu "suỵt!" giữ im lặng, thổi hơi mạnh, không rung cổ.',
    trap: 'Quên chu môi nên "she" nghe bị bẹt thành "see".',
    pair: ['she /ʃiː/', 'see /siː/'],
  },
  'ʒ': {
    vs: '/z/ hoặc /dʒ/',
    cue: 'Chu môi giống âm /ʃ/ (suỵt), nhưng bật rung cổ họng để tạo âm mềm như trong "vision".',
    trap: 'Hay đọc cứng thành "dờ" hoặc mất độ êm của luồng hơi.',
    pair: ['measure /ˈmeʒər/', 'major /ˈmeɪdʒər/'],
  },
  'tʃ': {
    vs: '/ʃ/ hoặc /tr/',
    cue: 'Chu môi, chặn hơi bằng mặt lưỡi chạm vòm miệng rồi bật mạnh ra như "chờ" nhưng bật gió rõ hơn.',
    trap: 'Đọc thiếu lực bật hơi hoặc đọc bẹt môi giống "ch" miền Bắc.',
    pair: ['cheap /tʃiːp/', 'sheep /ʃiːp/'],
  },
  'dʒ': {
    vs: '/z/ hoặc /tʃ/',
    cue: 'Khẩu hình y hệt /tʃ/ (chu môi, bật lưỡi), nhưng có rung cổ họng mạnh như từ "job".',
    trap: 'Đọc trượt thành "dờ" hoặc "giờ" nhẹ mà không có bước chặn hơi.',
    pair: ['jeep /dʒiːp/', 'cheap /tʃiːp/'],
  },
  'uː': {
    vs: '/ʊ/',
    cue: 'Chu môi tròn nhỏ như đang huýt sáo, kéo dài âm "u" rõ ràng.',
    trap: 'Không chu tròn môi khiến âm bị đục và ngắn.',
    pair: ['fool /fuːl/', 'full /fʊl/'],
  },
  'ʊ': {
    vs: '/uː/',
    cue: 'Thả lỏng môi, chỉ hơi nhô nhẹ, phát âm cực ngắn nằm giữa "u" và "ư".',
    trap: 'Đọc thành "u" dài khiến "good" nghe nặng nề.',
    pair: ['pull /pʊl/', 'pool /puːl/'],
  },
  'ɜː': {
    vs: '/ə/',
    cue: 'Giữ lưỡi lơ lửng giữa khoang miệng, hơi cong nhẹ đầu lưỡi về sau và kéo dài âm "ơ".',
    trap: 'Đọc quá ngắn hoặc tách thành "ơ-rờ" rời rạc.',
    pair: ['work /wɜːk/', 'walk /wɔːk/'],
  },
  'ə': {
    vs: '/ʌ/ hoặc /ɜː/',
    cue: 'Âm lười nhất tiếng Anh: thả lỏng toàn bộ miệng, lướt cực nhanh và nhẹ âm "ơ" ở âm tiết không nhấn.',
    trap: 'Cố đọc rõ từng chữ cái (như đọc "banana" thành ba-na-na thay vì bə-naa-nə).',
    pair: ['about /əˈbaʊt/', 'above /əˈbʌv/'],
  },
  'p': {
    vs: '/b/',
    cue: 'Mím chặt hai môi rồi bật luồng gió mạnh ra (đặt tờ giấy trước miệng phải thấy giấy rung).',
    trap: 'Đọc không bật hơi khiến "pen" nghe thành "ben".',
    pair: ['pin /pɪn/', 'bin /bɪn/'],
  },
  't': {
    vs: '/d/',
    cue: 'Đặt đầu lưỡi lên gờ lợi sau răng trên rồi bật hơi dứt khoát, không đặt lưỡi sát răng như "t" Việt.',
    trap: 'Đọc thành chữ "t" không bật hơi của tiếng Việt.',
    pair: ['time /taɪm/', 'dime /daɪm/'],
  },
  'k': {
    vs: '/g/',
    cue: 'Nâng cuống lưỡi chạm vòm mềm rồi bật mạnh luồng khí ra, cổ họng hoàn toàn không rung.',
    trap: 'Nuốt âm cuối /k/ ở các từ như "back", "work", "make".',
    pair: ['coat /kəʊt/', 'goat /ɡəʊt/'],
  },
  'r': {
    vs: '/l/',
    cue: 'Hơi chu môi, uốn cong đầu lưỡi về phía sau nhưng tuyệt đối không để đầu lưỡi chạm nóc miệng.',
    trap: 'Đọc rung lưỡi kiểu "rờ" tiếng Việt hoặc lẫn sang "l".',
    pair: ['right /raɪt/', 'light /laɪt/'],
  },
  'l': {
    vs: '/n/ hoặc /r/',
    cue: 'Đầu lưỡi chạm chắc vào gờ lợi ngay sau răng cửa trên, để luồng hơi thoát qua hai bên mép lưỡi.',
    trap: 'Bỏ quên âm /l/ tối ở cuối từ như "feel", "school", "all".',
    pair: ['light /laɪt/', 'night /naɪt/'],
  },
  'ŋ': {
    vs: '/n/',
    cue: 'Đọc như chữ "ng" cuối từ tiếng Việt (như "hàng"), hạ cuống lưỡi và để hơi đi qua mũi, không bật "g" thừa.',
    trap: 'Đọc nhầm thành /n/ hoặc bật mạnh chữ "gờ" ở cuối từ "sing".',
    pair: ['thing /θɪŋ/', 'thin /θɪn/'],
  },
}

export function getIpaTip(symbol: string): IpaViTip | null {
  const clean = symbol.replaceAll('/', '').trim()
  return IPA_VI_TIPS[clean] ?? null
}
