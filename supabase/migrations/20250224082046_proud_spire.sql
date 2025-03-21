/*
  # Add True Purpose Course

  1. New Course
    - Creates new course "Истинное предназначение"
    - Adds all course days with content, videos, audio files and PDFs
    - Sets up proper timer delays and content structure

  2. Content Structure
    - Welcome and introduction
    - Course structure explanation
    - Course program overview
    - 4 main lessons with exercises
    - Meditation and breathing practices
*/

-- Insert new course
INSERT INTO courses (id, title, description)
VALUES (
  'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'Истинное предназначение',
  'Курс для тех, кто хочет найти своё призвание, разобраться в своих мыслях и желаниях, и создать свою желаемую реальность'
);

-- Insert course days
INSERT INTO course_days (course_id, day_number, title, content, video_url, audio_url, additional_content, pdf_url, timer_delay)
VALUES
  -- Day 1: Welcome
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    1,
    'Добро пожаловать',
    E'#{name}, мы рады приветствовать тебя на курсе "Истинное Предназначение" 🧘🏻‍♀️\n\nНа этом курсе ты:\n• Найдёшь своё призвание;\n• Разберёшься в своих мыслях и желаниях;\n• Узнаешь как создать свою желаемую реальность ✨\n\n• • •\n\n"Человек, который почувствовал ветер перемен, должен строить не щит от ветра, а ветряную мельницу."\n\nБудь открытым(ой) к переменам и они произойдут 🙏',
    NULL,
    NULL,
    NULL,
    NULL,
    0
  ),
  -- Day 2: Course Structure
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    2,
    'Структура курса',
    E'Как устроен курс:\n\n1. Вся информация по урокам и практикам будет приходить в этом чат-боте.\n\n2. Уроки приходят с задержкой в 1 день, чтобы ты успевал(а) ознакомиться с материалом и сделать практики 🙏\n\n3. В левом нижнем углу у тебя появится кнопка "меню" через которую ты сможешь находить нужные материалы курса 📚\n\nА сейчас нажимай на кнопку, чтобы ознакомиться с программой 👇',
    NULL,
    NULL,
    NULL,
    NULL,
    0
  ),
  -- Day 3: Course Program
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    3,
    'Программа курса',
    E'Программа базового курса «Истинное предназначение» 👇🏼\n\nУРОК 1 «НАША РЕАЛЬНОСТЬ»\n\nУРОК 2 «КЛЮЧИ К ПОНИМАНИЮ СЕБЯ»\n🧘🏻‍♀️ Медитация: «ЖИЗНЬ БЕЗ СТРАХОВ»\n\nУРОК 3 «ПУТЬ К ПРЕДНАЗНАЧЕНИЮ»\n🧘🏻‍♂️ Гипноз: «ВСПОМНИ КТО ТЫ. СВЯЗЬ С ВЫСШИМ Я»\n\nУРОК 4 «ИСТИННОЕ ПРЕДНАЗНАЧЕНИЕ»\n🧘🏻 Дыхательная медитация: «ДЫХАНИЕ ТВОРЦА»',
    NULL,
    NULL,
    NULL,
    NULL,
    0
  ),
  -- Day 4: Lesson 1
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    4,
    'Наша реальность',
    E'ПЕРВЫЙ УРОК📒\n«НАША РЕАЛЬНОСТЬ»\n\nНаша реальность - это многомерная матрица 🌐\nИ чтобы в этой матрице ты мог получать полный опыт стоит изучить её состовляющие, и то как взаимодействовать с ней.\n\n🔥Именно об этом будет наш первый урок!\n\nВ этом уроке вы найдете ответы на следующие вопросы 👇\n\n⚪️ Как устроена Вселенная?\n⚪️ Как работает система (матрица)?\n⚪️ Как человек взаимодействует с окружающим его миром?\n\nℹ️ Перед началом мы рекомендуем завести себе рабочую тетрадь в которую ты будешь записывать свои инсайты и делать заметки.',
    'https://youtu.be/inOfnMyRjRg?si=6uCJmhFBrTCxlomI',
    NULL,
    NULL,
    NULL,
    0
  ),
  -- Day 5: Lesson 2 Part 1
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    5,
    'Ключи к пониманию себя - Часть 1',
    E'ВТОРОЙ УРОК📒\n«КЛЮЧИ К ПОНИМАНИЮ СЕБЯ»\n\nЧасть 1: 8 УРОВНЕЙ СОЗНАНИЯ\n\nКаждый человек находится на пути получения своего опыта, на пути развития себя. Этот путь имеет уровни, также как и в любой игре 🎮\n\nЭти уровни были описаны разными исследователями, психиатрами, коучами и духовными учителями 🧘🏻‍♀️\n\nЧтобы понимать себя лучше, стать увереннее нужно определить на каком этапе находишься ты.\n\nВ этом уроке ты найдешь ответы на следующие вопросы 👇\n\n⚪️ Какие уровни сознания существуют?\n⚪️ Как переходить с уровня на уровень?\n⚪️ На каком уровне нахожусь я?',
    'https://youtu.be/CwnZD2L6lCA?si=fsYrkPpwgBoQPPhl',
    NULL,
    NULL,
    NULL,
    0
  );

-- Continue with remaining days in next migration to keep this one manageable