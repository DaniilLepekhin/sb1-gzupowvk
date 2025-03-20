/*
  # Add True Purpose Course - Part 2
  
  Continues adding course days for the True Purpose course
*/

INSERT INTO course_days (course_id, day_number, title, content, video_url, audio_url, additional_content, pdf_url, timer_delay)
VALUES
  -- Day 6: Lesson 2 Part 2
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    6,
    'Ключи к пониманию себя - Часть 2',
    E'Часть 2: Топ 10 страхов мешающих твоему росту\n\nВсе эти страхи проявляются у нас в разное время, в разных ситуациях. Важно знать их, уметь отследить и предпринять действия которые помогут пройти через них 🔥\n\nПосле просмотра этого урока, подумай, какой из этих страхов проявляется у тебя чаще всего. Проанализируй и запиши, что ты сделаешь, чтобы избавиться от него.',
    'https://youtu.be/gLLXJE0NNFQ?si=cWYb8FeMmiA9k95N',
    NULL,
    NULL,
    NULL,
    0
  ),
  -- Day 7: Lesson 2 Part 3
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    7,
    'Ключи к пониманию себя - Часть 3',
    E'Часть 3: Ответственность\n\nПереход по уровням сознания и избавление от страхов происходит когда человек берет на себя ответственность за свои мысли, слова, действия и за события происходящие в его жизни 💯\n\nИменно об этом 3я часть 2го урока 🔥',
    'https://youtu.be/MvJDLsmPyeo?si=CfXVyVYRnRbIiQt7',
    NULL,
    NULL,
    NULL,
    5
  ),
  -- Day 8: Meditation - Life Without Fear
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    8,
    'Медитация "Жизнь без страха"',
    E'🧘🏻‍♀️ МЕДИТАЦИЯ «ЖИЗНЬ БЕЗ СТРАХА»\n\nВ действительности 90% всех страхов являются невротичными, то есть придуманными беспокойным мозгом 🧠\n\nДанная медитация поможет тебе успокоиться, избавиться от тревожных мыслей и навязанных страхов 🙏\n\nПриятной практики 🫶',
    NULL,
    'https://files.salebot.pro/uploads/file_item/file/261854/Медитация_____️_Жизнь_Без_Страха_.mp3',
    NULL,
    NULL,
    5
  ),
  -- Day 9: Lesson 3
  (
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    9,
    'Путь к предназначению',
    E'ТРЕТИЙ УРОК📒\n«ПУТЬ К ПРЕДНАЗНАЧЕНИЮ»\n\nКаждый из нас хочет прожить счастливую, наполненную, богатую жизнь и логично сказать, что это возможно только когда человек находится в своём предназначении 💯\n\nЧтобы определить предназначение нужно глубоко погрузиться в себя и найти там ответы на этот важный вопрос 🙌🏼\n\nВ этом уроке ты найдешь ответы на следующие вопросы 👇\n\n⚪️ Что такое предназначение?\n⚪️ Как найти своё предназначение?\n\nДля просмотра второго урока нажми на кнопку "Посмотреть видео 🎥"\n\nПосле просмотра обязательно возвращайся в бот и начни выполнять письменные задания 📝',
    'https://youtu.be/VEQj3qaqIsk?si=ffJjv9t4u3E8Cr7l',
    NULL,
    NULL,
    NULL,
    0
  );

-- Continue with remaining days in next migration