/*
  # Add course content fields and days

  1. Schema Changes
    - Add new columns to course_days table for additional content types
    - Add indexes for performance optimization
    
  2. Data
    - Add days 4-5 for "Стратегии Будущего" course
    
  3. Security
    - Maintain existing RLS policies
*/

-- Add new columns to course_days
ALTER TABLE course_days
ADD COLUMN IF NOT EXISTS audio_url text,
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS pdf_url text,
ADD COLUMN IF NOT EXISTS meditation_guide text,
ADD COLUMN IF NOT EXISTS additional_content text,
ADD COLUMN IF NOT EXISTS welcome_content text,
ADD COLUMN IF NOT EXISTS course_info text,
ADD COLUMN IF NOT EXISTS gift_content text,
ADD COLUMN IF NOT EXISTS stream_link text,
ADD COLUMN IF NOT EXISTS timer_delay integer;

-- Insert remaining days for "Стратегии Будущего"
INSERT INTO course_days (
  course_id, 
  day_number, 
  title, 
  content, 
  video_url, 
  additional_content,
  pdf_url
)
VALUES
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    4,
    'Уровни сознания',
    E'Уровни сознания - тема которая обсуждалась уже много раз, но для кого-то будет в новинку.\n\nЧто нужно знать перед просмотром урока:\n\nВ нашем мире существуют уровни по которым следует подниматься каждому человеку.\n\nКаждый уровень наполнен своими "испытаниями", через которые должен пройти человек, чтобы перейти дальше.\n\nПоднимаясь по уровням человек начинает жить более качественную и яркую жизнь.\n\nОпределив на каком уровне ты находишься сейчас, тебе будет понятнее через какие "испытания" нужно пройти.\n\nСмотри урок, а затем возвращайся в бота для выполнения практики 👇',
    'https://youtu.be/JNwMqS8uC84?si=Wn_u9WV6FfnS84v6',
    E'1. Спящий\n2. Борец\n3. Искатель\n4. Личность\n5. Игрок\n6. Маг\n7. Творец\n8. Источник\n\nОпределение своего уровня довольно непростая задача. Иногда может показаться, что ты находишься на всех уровнях сразу, но это не так.\n\nНа каждом уровне ты находишься в процессе решения каких-то проблем/испытаний.\n\nЧтобы определить свой уровень нужно ответить на несколько вопросов:\n\n1. Какой вопрос меня волнует сейчас больше всего?\n\nПодумай, что тебя заботит уже долгое время? Ответ на какой вопрос ты ищешь чаще всего?\n\n2. Почему меня волнует именно этот вопрос?\n\n3. Какие события в моей жизни чаще всего вызывают у меня этот вопрос?\n\n4. Почему именно эти события вызывают у меня этот вопрос?\n\n5. Что мешает мне найти ответ на этот вопрос?\n\n6. К какому уровню относится этот вопрос и на какой уровень я перейду найдя ответ?',
    null
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    5,
    'Работа с дневником',
    E'📓 Как отвечать на вопросы и заполнять дневник.\n\n❗️Самое важное❗️\n\nОтключи своего контролёра и оценщика!\nПиши всё, что приходит в голову, пиши как чувствуешь.\n\nПиши как можно подробнее. Не останавливайся на двух предложениях.\n\nПредставь, что рассказываешь это человеку который на 100% тебя понимает и тебе интересно об этом говорить.\n\nЦель письменных практик - НАУЧИТЬ СЕБЯ ОБЩАТЬСЯ С СОБОЙ!\n\nНиже я прикрепил пример того как стоит отвечать на эти вопросы 👇',
    null,
    null,
    'https://files.salebot.pro/uploads/file_item/file/261854/ДНЕВНИК._Практика_1.pdf'
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_days_audio_url ON course_days(audio_url) WHERE audio_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_course_days_video_url ON course_days(video_url) WHERE video_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_course_days_pdf_url ON course_days(pdf_url) WHERE pdf_url IS NOT NULL;