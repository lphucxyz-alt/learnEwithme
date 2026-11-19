type Place = 'front' | 'central' | 'back' | 'lips' | 'lip-teeth' | 'teeth' | 'ridge' | 'postalveolar' | 'palate' | 'velum' | 'glottis'
type Quality = [Place, number, number]
type Vowel = [string, string, Quality, string, string, Quality?]
type Consonant = [string, string, Place, 'stop' | 'fricative' | 'affricate' | 'nasal' | 'approximant' | 'lateral', boolean, string, string]

const vowels: Vowel[] = [
  ['iː','sheep',['front',1,0],'Nâng phần trước lưỡi sát vòm, kéo nhẹ hai khóe môi.','Giữ nguyên vị trí và độ dài, tránh trượt thành hai âm.'],
  ['ɪ','ship',['front',2,0],'Nâng phần trước lưỡi, hạ thấp hơn /iː/ và thả lỏng môi.','Đừng chỉ rút ngắn /iː/ mà giữ nguyên vị trí lưỡi.'],
  ['e','bed',['front',3,0],'Hạ lưỡi và hàm vừa phải, môi trung tính.','Đừng mở hàm rộng như /æ/.'],
  ['æ','bad',['front',4,0],'Hạ hàm rõ, giữ lưỡi thấp và về trước.','Tránh thay bằng /e/ hoặc âm a lùi ra sau.'],
  ['ʌ','cup',['central',4,0],'Giữ lưỡi thấp ở giữa, môi thả lỏng.','Tránh làm tròn môi như /ɒ/.'],
  ['ɑː','cart',['back',5,0],'Mở hàm, hạ và lùi lưỡi, môi không tròn.','Giữ âm đủ dài và tránh thêm /r/ cuối trong mẫu Anh–Anh.'],
  ['ɒ','cot',['back',4,2],'Hạ lưỡi về sau, môi hơi tròn.','Đừng kéo dài như /ɔː/.'],
  ['ɔː','caught',['back',3,3],'Nâng phần sau lưỡi và làm tròn môi.','Giữ một nguyên âm ổn định, tránh thêm âm cuối.'],
  ['ʊ','full',['back',2,2],'Nâng nhẹ phần sau lưỡi, môi tròn lỏng.','Tránh chu môi và kéo dài như /uː/.'],
  ['uː','fool',['back',1,3],'Nâng thân lưỡi cao và giữ môi tròn.','Phân biệt cả vị trí lưỡi lẫn độ dài với /ʊ/.'],
  ['ɜː','bird',['central',3,0],'Giữ phần giữa lưỡi cao vừa, môi thả lỏng.','Giữ âm dài, không thêm /r/ khép âm trong mẫu Anh–Anh.'],
  ['ə','about',['central',3,0],'Thả lỏng lưỡi và môi ở âm tiết không nhấn.','Tránh đọc mọi âm tiết với lực như nhau.'],
  ['eɪ','late',['front',3,0],'Trượt từ /e/ lên vị trí gần /ɪ/.','Không tách thành hai âm tiết.',['front',2,0]],
  ['aɪ','light',['central',5,0],'Mở hàm rồi nâng phần trước lưỡi.','Giữ chuyển động liền mạch.',['front',2,0]],
  ['ɔɪ','boy',['back',3,3],'Bắt đầu với môi tròn, rồi dẹt môi khi lưỡi tiến lên.','Đừng bỏ phần trượt cuối.',['front',2,0]],
  ['əʊ','coat',['central',3,0],'Từ giữa khoang miệng, nâng thân lưỡi và tròn môi dần.','Tránh đọc thành nguyên âm đơn.',['back',2,2]],
  ['aʊ','house',['central',5,0],'Mở hàm rồi nâng lưỡi về sau và tròn môi.','Không thêm phụ âm /w/ tách rời.',['back',2,2]],
  ['ɪə','near',['front',2,0],'Từ /ɪ/, thả lưỡi về giữa và mở hàm nhẹ.','Giữ trong một âm tiết.',['central',3,0]],
  ['eə','hair',['front',3,0],'Bắt đầu ở /e/ rồi thả lưỡi về giữa.','Trong giọng Anh–Anh truyền thống không thêm /r/ cuối.',['central',3,0]],
  ['ʊə','tour',['back',2,2],'Từ /ʊ/, thả lỏng môi và đưa lưỡi về giữa.','Một số giọng Anh hiện đại dùng /ɔː/ ở từ này.',['central',3,0]]
]
const consonants: Consonant[] = [
  ['p','pat','lips','stop',false,'Khép hai môi, tích hơi rồi bật ra.','Ở đầu âm tiết nhấn, luồng hơi thường bật rõ.'],
  ['b','bat','lips','stop',true,'Khép và bật hai môi, duy trì hữu thanh khi có thể.','Tránh thêm nguyên âm sau /b/ cuối.'],
  ['t','tie','ridge','stop',false,'Chặn hơi bằng đầu lưỡi ở lợi trên rồi nhả.','Đừng bỏ hẳn âm cuối.'],
  ['d','die','ridge','stop',true,'Chạm đầu lưỡi vào lợi trên và nhả.','Tránh thay bằng âm xát /z/.'],
  ['k','coat','velum','stop',false,'Nâng lưng lưỡi chạm ngạc mềm và nhả hơi.','Không thêm /ə/ sau âm cuối.'],
  ['ɡ','goat','velum','stop',true,'Nâng lưng lưỡi chặn hơi ở ngạc mềm rồi nhả.','Tránh đọc bằng âm xát như g trong tiếng Việt.'],
  ['f','fan','lip-teeth','fricative',false,'Đặt răng trên nhẹ lên môi dưới và thổi hơi.','Không khép cả hai môi.'],
  ['v','van','lip-teeth','fricative',true,'Đặt răng trên lên môi dưới và tạo ma sát có rung.','Đừng bỏ rung và biến thành /f/.'],
  ['θ','thin','teeth','fricative',false,'Đặt đầu lưỡi nhẹ giữa hai hàm răng, thổi hơi liên tục.','Tránh thay bằng /t/ hoặc /s/.'],
  ['ð','then','teeth','fricative',true,'Giữ đầu lưỡi sát răng và tạo ma sát có rung.','Tránh thay bằng /d/.'],
  ['s','sip','ridge','fricative',false,'Tạo rãnh hẹp giữa phần trước lưỡi và lợi trên.','Giữ đầu lưỡi trong miệng.'],
  ['z','zip','ridge','fricative',true,'Giữ khe hẹp như /s/ và thêm rung.','Tránh mất hữu thanh ở cuối từ.'],
  ['ʃ','ship','postalveolar','fricative',false,'Đưa phiến lưỡi lên sau lợi, hơi tròn môi.','Đừng đưa lưỡi ra trước như /s/.'],
  ['ʒ','vision','postalveolar','fricative',true,'Tạo ma sát sau lợi và rung dây thanh.','Tránh chặn hơi hoàn toàn như /dʒ/.'],
  ['h','hat','glottis','fricative',false,'Thả hơi qua thanh môn và chuẩn bị khẩu hình nguyên âm.','Tránh kéo lưỡi sâu vào họng.'],
  ['tʃ','cheap','postalveolar','affricate',false,'Chặn hơi sau lợi rồi nhả thành ma sát.','Giữ giai đoạn ma sát sau khi bật.'],
  ['dʒ','jeep','postalveolar','affricate',true,'Chặn hơi rồi nhả thành tiếng xát hữu thanh sau lợi.','Tránh đọc như /z/ hoặc /j/.'],
  ['m','sum','lips','nasal',true,'Khép môi, hạ ngạc mềm để hơi thoát qua mũi.','Giữ môi khép ở cuối từ.'],
  ['n','sun','ridge','nasal',true,'Chạm đầu lưỡi vào lợi trên và cho hơi qua mũi.','Đừng khép môi như /m/.'],
  ['ŋ','sung','velum','nasal',true,'Chạm lưng lưỡi vào ngạc mềm, hơi đi qua mũi.','Không tự động thêm /ɡ/ cuối.'],
  ['l','light','ridge','lateral',true,'Chạm đầu lưỡi vào lợi, cho hơi thoát hai bên lưỡi.','Không thay bằng /n/.'],
  ['r','right','postalveolar','approximant',true,'Nâng phần trước lưỡi về sau lợi mà không chạm vòm.','Tránh rung đầu lưỡi hoặc tạo tiếng xát mạnh.'],
  ['j','yet','palate','approximant',true,'Nâng thân lưỡi gần ngạc cứng rồi trượt vào nguyên âm.','Đừng thay bằng /z/.'],
  ['w','wet','velum','approximant',true,'Nâng lưng lưỡi, tròn môi rồi mở nhanh vào nguyên âm.','Đừng đặt răng lên môi như /v/.']
]
export const sounds = [
  ...vowels.map(([symbol, word, shape, instruction, mistake, end]) => ({
    symbol, word, shape, instruction, mistake, end, voiced: true, manner: 'vowel',
    group: end ? 'Nguyên âm đôi' : 'Nguyên âm đơn'
  })),
  ...consonants.map(([symbol, word, place, manner, voiced, instruction, mistake]) => ({
    symbol, word, shape: [place, 2, /^(w|ʃ|ʒ|tʃ|dʒ)$/.test(symbol) ? 2 : 0] as Quality,
    instruction, mistake, end: undefined, voiced, manner, group: voiced ? 'Phụ âm hữu thanh' : 'Phụ âm vô thanh'
  }))
]
export type Sound = typeof sounds[number]
export const pairs = [
  { sounds: ['iː','ɪ'], words: ['sheep','ship'] },
  { sounds: ['æ','e'], words: ['bad','bed'] },
  { sounds: ['θ','ð'], words: ['thigh','thy'] },
  { sounds: ['p','b'], words: ['pat','bat'] },
  { sounds: ['f','v'], words: ['fan','van'] },
  { sounds: ['ʊ','uː'], words: ['full','fool'] },
  { sounds: ['l','r'], words: ['light','right'] },
  { sounds: ['s','ʃ'], words: ['sip','ship'] },
  { sounds: ['n','ŋ'], words: ['sin','sing'] },
  { sounds: ['eɪ','aɪ'], words: ['late','light'] },
]
