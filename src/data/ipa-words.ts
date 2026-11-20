import { sounds } from './ipa.ts'

type Example = readonly [word: string, phonetic: string, meaning: string]
export type SoundPosition = 'đầu' | 'giữa' | 'cuối'

export const ipaExamples: Record<string, readonly Example[]> = {
  'iː': [['eat', 'iːt', 'ăn'], ['sheep', 'ʃiːp', 'con cừu'], ['see', 'siː', 'nhìn thấy']],
  'ɪ': [['it', 'ɪt', 'nó'], ['ship', 'ʃɪp', 'tàu'], ['fish', 'fɪʃ', 'cá']],
  'e': [['egg', 'eɡ', 'quả trứng'], ['bed', 'bed', 'cái giường'], ['pen', 'pen', 'bút']],
  'æ': [['apple', 'ˈæpəl', 'quả táo'], ['bad', 'bæd', 'tệ'], ['map', 'mæp', 'bản đồ']],
  'ʌ': [['up', 'ʌp', 'lên'], ['cup', 'kʌp', 'cái cốc'], ['luck', 'lʌk', 'may mắn']],
  'ɑː': [['arm', 'ɑːm', 'cánh tay'], ['cart', 'kɑːt', 'xe đẩy'], ['star', 'stɑː', 'ngôi sao']],
  'ɒ': [['on', 'ɒn', 'ở trên'], ['cot', 'kɒt', 'giường nhỏ'], ['box', 'bɒks', 'cái hộp']],
  'ɔː': [['all', 'ɔːl', 'tất cả'], ['caught', 'kɔːt', 'đã bắt được'], ['saw', 'sɔː', 'đã nhìn thấy']],
  'ʊ': [['full', 'fʊl', 'đầy'], ['book', 'bʊk', 'quyển sách'], ['put', 'pʊt', 'đặt']],
  'uː': [['fool', 'fuːl', 'người ngốc'], ['blue', 'bluː', 'xanh dương'], ['food', 'fuːd', 'đồ ăn']],
  'ɜː': [['earn', 'ɜːn', 'kiếm được'], ['bird', 'bɜːd', 'con chim'], ['turn', 'tɜːn', 'rẽ']],
  'ə': [['about', 'əˈbaʊt', 'về'], ['support', 'səˈpɔːt', 'hỗ trợ'], ['sofa', 'ˈsəʊfə', 'ghế sofa']],
  'eɪ': [['eight', 'eɪt', 'số tám'], ['late', 'leɪt', 'muộn'], ['day', 'deɪ', 'ngày']],
  'aɪ': [['ice', 'aɪs', 'nước đá'], ['light', 'laɪt', 'ánh sáng'], ['my', 'maɪ', 'của tôi']],
  'ɔɪ': [['oil', 'ɔɪl', 'dầu'], ['coin', 'kɔɪn', 'đồng xu'], ['boy', 'bɔɪ', 'cậu bé']],
  'əʊ': [['open', 'ˈəʊpən', 'mở'], ['coat', 'kəʊt', 'áo khoác'], ['go', 'ɡəʊ', 'đi']],
  'aʊ': [['out', 'aʊt', 'ra ngoài'], ['house', 'haʊs', 'ngôi nhà'], ['now', 'naʊ', 'bây giờ']],
  'ɪə': [['earring', 'ˈɪərɪŋ', 'khuyên tai'], ['clearly', 'ˈklɪəli', 'một cách rõ ràng'], ['near', 'nɪə', 'gần']],
  'eə': [['airline', 'ˈeəlaɪn', 'hãng hàng không'], ['careful', 'ˈkeəfəl', 'cẩn thận'], ['hair', 'heə', 'tóc']],
  'ʊə': [['tourist', 'ˈtʊərɪst', 'khách du lịch'], ['pure', 'pjʊə', 'tinh khiết'], ['tour', 'tʊə', 'chuyến tham quan']],
  p: [['pat', 'pæt', 'vỗ nhẹ'], ['open', 'ˈəʊpən', 'mở'], ['cup', 'kʌp', 'cái cốc']],
  b: [['bat', 'bæt', 'con dơi'], ['table', 'ˈteɪbəl', 'cái bàn'], ['cab', 'kæb', 'xe taxi']],
  t: [['tie', 'taɪ', 'cà vạt'], ['water', 'ˈwɔːtə', 'nước'], ['cat', 'kæt', 'con mèo']],
  d: [['die', 'daɪ', 'chết'], ['ladder', 'ˈlædə', 'cái thang'], ['bed', 'bed', 'cái giường']],
  k: [['coat', 'kəʊt', 'áo khoác'], ['baker', 'ˈbeɪkə', 'thợ làm bánh'], ['book', 'bʊk', 'quyển sách']],
  ɡ: [['goat', 'ɡəʊt', 'con dê'], ['bigger', 'ˈbɪɡə', 'to hơn'], ['bag', 'bæɡ', 'cái túi']],
  f: [['fan', 'fæn', 'cái quạt'], ['coffee', 'ˈkɒfi', 'cà phê'], ['leaf', 'liːf', 'chiếc lá']],
  v: [['van', 'væn', 'xe tải nhỏ'], ['seven', 'ˈsevən', 'số bảy'], ['leave', 'liːv', 'rời đi']],
  θ: [['thin', 'θɪn', 'mỏng'], ['healthy', 'ˈhelθi', 'khỏe mạnh'], ['bath', 'bɑːθ', 'bồn tắm']],
  ð: [['then', 'ðen', 'sau đó'], ['mother', 'ˈmʌðə', 'mẹ'], ['breathe', 'briːð', 'thở']],
  s: [['sip', 'sɪp', 'nhấp một ngụm'], ['lesson', 'ˈlesən', 'bài học'], ['bus', 'bʌs', 'xe buýt']],
  z: [['zip', 'zɪp', 'kéo khóa'], ['easy', 'ˈiːzi', 'dễ'], ['rose', 'rəʊz', 'hoa hồng']],
  ʃ: [['ship', 'ʃɪp', 'tàu'], ['washing', 'ˈwɒʃɪŋ', 'việc giặt rửa'], ['fish', 'fɪʃ', 'cá']],
  ʒ: [['vision', 'ˈvɪʒən', 'thị lực'], ['measure', 'ˈmeʒə', 'đo'], ['beige', 'beɪʒ', 'màu be']],
  h: [['hat', 'hæt', 'cái mũ'], ['heat', 'hiːt', 'sức nóng'], ['behind', 'bɪˈhaɪnd', 'phía sau']],
  'tʃ': [['cheap', 'tʃiːp', 'rẻ'], ['teacher', 'ˈtiːtʃə', 'giáo viên'], ['watch', 'wɒtʃ', 'đồng hồ đeo tay']],
  'dʒ': [['jeep', 'dʒiːp', 'xe jeep'], ['major', 'ˈmeɪdʒə', 'chính, quan trọng'], ['edge', 'edʒ', 'rìa']],
  m: [['moon', 'muːn', 'mặt trăng'], ['summer', 'ˈsʌmə', 'mùa hè'], ['sum', 'sʌm', 'tổng']],
  n: [['nose', 'nəʊz', 'mũi'], ['dinner', 'ˈdɪnə', 'bữa tối'], ['sun', 'sʌn', 'mặt trời']],
  ŋ: [['finger', 'ˈfɪŋɡə', 'ngón tay'], ['singer', 'ˈsɪŋə', 'ca sĩ'], ['sung', 'sʌŋ', 'đã hát']],
  l: [['light', 'laɪt', 'ánh sáng'], ['pillow', 'ˈpɪləʊ', 'cái gối'], ['bell', 'bel', 'chuông']],
  r: [['right', 'raɪt', 'đúng'], ['carry', 'ˈkæri', 'mang'], ['green', 'ɡriːn', 'xanh lá']],
  j: [['yet', 'jet', 'chưa'], ['yes', 'jes', 'vâng'], ['onion', 'ˈʌnjən', 'hành tây']],
  w: [['wet', 'wet', 'ướt'], ['away', 'əˈweɪ', 'xa'], ['twin', 'twɪn', 'người sinh đôi']]
}

const phonemes = [...new Set([...sounds.map(sound => sound.symbol), 'i', 'u'])].sort((a, b) => b.length - a.length)

export function splitPhones(transcript: string, keepStress = false) {
  const tokens: string[] = []
  let rest = transcript.replace(keepStress ? /\s/g : /[ˈˌ.\s]/g, '')
  while (rest.length > 0) {
    const phoneme = phonemes.find(symbol => rest.startsWith(symbol)) ?? rest[0]
    tokens.push(phoneme)
    rest = rest.slice(phoneme.length)
  }
  return tokens
}

export function soundPosition(phones: string[], symbol: string): SoundPosition {
  if (phones[0] === symbol) return 'đầu'
  if (phones.at(-1) === symbol) return 'cuối'
  return 'giữa'
}
