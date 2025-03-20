/*
  # Update Strategy Course Content - Part 3

  Completes the content update for the "Стратегия будущего" course with:
  - Final days (11-12)
  - Meditation guides
  - Final practices
*/

-- Insert final course days
INSERT INTO course_days (course_id, day_number, title, content, video_url, audio_url, meditation_guide, pdf_url, timer_delay)
VALUES
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    11,
    'Настрой на день',
    E'#{name}, настрой на день это важнейший элемент счастливой и гармоничной жизни.\n\nНастрой на день - это когда ты понимаешь свои намерения на этот день, когда ты направляешь свои мысли, слова и действия на то, чтобы они привели тебя к новому уровню жизни.\n\nЭта дыхательная практика поможет тебе создать своё намерение на день и прибывать в полном сознании в течении этого дня!\n\nℹ️ Выполнять практику желательно утром после пробуждения.\n\nТакже ты можешь использовать её в течении дня если чувствуешь, что тебе нужно вернуть фокус на себя 🧘‍♀️',
    NULL,
    'https://files.salebot.pro/uploads/file_item/file/261854/Дыхательная_практика__Намерение_на_день_.mp3',
    NULL,
    NULL,
    0
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    12,
    'Намерение и материализация',
    E'Последний шаг к реализации твоей новой жизни ❤️\n\nВ этом уроке ты узнаешь что такое намерение, как оно работает и что нужно для того, чтобы твои желания материализовались в жизнь 💯\n\nЖми на кнопку, чтобы смотреть урок 👇',
    'https://youtu.be/IJ20Aoubi1c?si=4m0M89qpGxj_6dyx',
    NULL,
    E'Письменное выражение наших намерений помогает нам сосредоточиться на том, что действительно важно в нашей жизни.\n\nЭто помогает нам отделить суть от второстепенных вещей и сфокусироваться на том, что действительно имеет значение.\n\nКогда мы подписываемся под своими словами и обещаниями, мы принимаем ответственность за свои действия и решения.\n\nВыполни новую практику в дневнике 👇',
    'https://files.salebot.pro/uploads/file_item/file/261854/Дневник_Практика_5.pdf',
    0
  );