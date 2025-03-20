/*
  # Add Intuition Course

  1. New Course
    - Creates new course "Погружение в интуицию"
    - Adds all course days with content, videos, audio files
    - Sets up proper content structure and timing

  2. Content Structure
    - Welcome and introduction
    - 4 main lessons
    - 4 deep practices
    - Multiple audio recordings and meditations
*/

-- Insert new course
INSERT INTO courses (id, title, description)
VALUES (
  'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'Погружение в интуицию',
  'Курс для тех, кто хочет развить свою интуицию, научиться получать ответы и считывать интуитивные знаки'
);

-- Insert course days
INSERT INTO course_days (course_id, day_number, title, content, video_url, audio_url, additional_content, welcome_content, timer_delay)
VALUES
  -- Day 1: Welcome
  (
    'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    1,
    'Добро пожаловать',
    E'Приветствуем тебя на курсе «Погружение в Интуицию» 🪬\n\nНа этом обучении ты разберешь:\n\n- что такое интуиция;\n- как получать ответы от интуиции;\n- как считывать интуитивные знаки;\n- как установить связь со своей интуицией и доверять ей;\n- узнаешь техники получения интуитивной информации.\n\n📚 4 урока\n🧘🏻‍♀️ 4 глубокие практики',
    NULL,
    'https://files.salebot.pro/uploads/file_item/file/261854/Интуиция___формирование_этого_знания_в_античности__️.mp3',
    NULL,
    NULL,
    0
  ),
  -- Day 2: Getting Started
  (
    'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    2,
    'Начинаем погружение',
    E'Заждались? 👀\n\nГотовьте ручку и тетради!\n\nНачинаем глубокое погружение 🤿',
    NULL,
    NULL,
    NULL,
    NULL,
    0
  ),
  -- Day 3: Lesson 2 - Soul Vessel
  (
    'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    3,
    'Сосуд души',
    E'УРОК ВТОРОЙ «СОСУД ДУШИ» 🪬\n\nВ данном уроке мы разобрали:\n\n ⁃ в каком энергоцентре находится шишковидная железа;\n⁃ за что она отвечает;\n⁃ что может блокировать эту чакру и что способствует её активации;\n⁃ как физически ощущается раскрытие третьего глаза;\n⁃ что способствует выходу на высокие вибрации и плоскость 5-го измерения\n\nВозможно придётся прослушать несколько раз 👁️',
    NULL,
    'https://files.salebot.pro/uploads/file_item/file/261854/Сосуд_Души_____️_Пятое_измерение.mp3',
    NULL,
    NULL,
    0
  ),
  -- Day 4: Lesson 2 - Illusory World
  (
    'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    4,
    'Иллюзорный и реальный мир',
    E'ВТОРОЙ УРОК📒\n«ИЛЛЮЗОРНЫЙ И РЕАЛЬНЫЙ МИР, КАК УВИДЕТЬ ТО ЧТО СКРЫТО?»\n\nМир совсем не таков, каким мы привыкли его видеть. Не простое дело – осознать: всё, что мы видим вокруг себя – это лишь видимость. Это отражение наших собственных представлений о мире, и не более того.\n\nВ этом уроке ты узнаешь 👇\n\n⚪️ Иллюзорный мир, как не попасть в ловушку мысли форм\n⚪️ Система раздвигающая границы восприятия\n⚪️ Считывание интуитивных знаков\n\nЧтобы прослушать урок жми ▶️',
    NULL,
    'https://files.salebot.pro/uploads/file_item/file/261854/2025-02-20_21.40.08.ogg',
    NULL,
    NULL,
    0
  );

-- Continue with remaining days in next migration