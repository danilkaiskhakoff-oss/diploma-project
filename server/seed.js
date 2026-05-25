const db = require('./db');

// Ждем инициализации БД
setTimeout(() => {
  console.log('Очищаем старые демо-данные...');

  // Удаляем всё, кроме пользователей teacher1 и student1
  db.serialize(() => {
    db.run(`DELETE FROM submissions`);
    db.run(`DELETE FROM assignments`);
    db.run(`DELETE FROM progress`);
    db.run(`DELETE FROM enrollments`);
    db.run(`DELETE FROM lessons`);
    db.run(`DELETE FROM courses`);
    db.run(`DELETE FROM subjects`);
    // Удаляем всех пользователей, кроме teacher1 и student1
    db.run(`DELETE FROM users WHERE username NOT IN ('teacher1', 'student1')`);

    console.log('База очищена. Добавляем новые демо-данные...');

    // 1. Создаем преподавателя (если удален)
    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('teacher1', '123', 'teacher')`, function () {
      const teacherId = this.lastID || 1;

      // 2. Создаем студента (если удален)
      db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('student1', '123', 'student')`, function () {
        const studentId = this.lastID || 2;

        // 3. Создаем предмет
        db.run(`INSERT INTO subjects (name, description, theme_color, teacher_id) VALUES ('Программирование на Python', 'Изучение основ программирования с нуля', '#10b981', ?)`, [teacherId], function () {
          const subjectId = this.lastID;

          // 4. Создаем курсы
          const courses = [
            { title: 'Введение в Python', description: 'Переменные, типы данных, ввод/вывод' },
            { title: 'Условные конструкции', description: 'if, else, elif и логические операции' },
            { title: 'Циклы', description: 'for, while, break, continue' },
          ];

          let created = 0;
          courses.forEach((c, idx) => {
            db.run(`INSERT INTO courses (subject_id, title, description) VALUES (?, ?, ?)`, [subjectId, c.title, c.description], function () {
              const courseId = this.lastID;

              // Записываем студента на курс
              db.run(`INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)`, [studentId, courseId]);

              const lessons = [];
              if (idx === 0) {
                lessons.push(
                  { title: 'Что такое Python', type: 'text', content: 'Python — это высокоуровневый язык программирования.\n\nОн используется для:\n• Веб-разработки\n• Анализа данных\n• Искусственного интеллекта\n• Автоматизации\n\nПример кода:\nprint("Hello, World!")' },
                  { title: 'Переменные и типы', type: 'text', content: 'В Python есть несколько типов данных:\n\n• str — строка: "Привет"\n• int — целое число: 42\n• float — дробное число: 3.14\n• bool — логическое: True/False\n\nПример:\nname = "Алекс"\nage = 20\nheight = 1.75' },
                  { title: 'Тест: Основы', type: 'quiz', content: JSON.stringify([
                    { question: 'Какой тип данных у числа 3.14?', options: ['int', 'float', 'str', 'bool'], correctIndex: 1 },
                    { question: 'Что выведет print("Hello")?', options: ['Error', 'Hello', 'hello', 'HELLO'], correctIndex: 1 },
                  ]) }
                );
              }
              if (idx === 1) {
                lessons.push(
                  { title: 'Оператор if', type: 'text', content: 'Условная конструкция позволяет выполнять код по условию.\n\nПример:\nage = 18\nif age >= 18:\n    print("Совершеннолетний")\nelse:\n    print("Несовершеннолетний")' },
                  { title: 'Логические операции', type: 'text', content: 'В Python есть логические операторы:\n\n• and — И\n• or — ИЛИ\n• not — НЕ\n\nПример:\nage = 25\nif age >= 18 and age < 65:\n    print("Трудоспособный")' },
                  { title: 'Тест: Условия', type: 'quiz', content: JSON.stringify([
                    { question: 'Какой оператор означает "И"?', options: ['or', 'not', 'and', 'if'], correctIndex: 2 },
                    { question: 'Что выведет 5 > 3?', options: ['False', 'True', 'Error', '5'], correctIndex: 1 },
                  ]) }
                );
              }
              if (idx === 2) {
                lessons.push(
                  { title: 'Цикл for', type: 'text', content: 'Цикл for используется для перебора элементов.\n\nПример:\nfor i in range(5):\n    print(i)\n\nВыведет: 0, 1, 2, 3, 4' },
                  { title: 'Цикл while', type: 'text', content: 'Цикл while выполняется пока условие истинно.\n\nПример:\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1' },
                  { title: 'Тест: Циклы', type: 'quiz', content: JSON.stringify([
                    { question: 'Сколько раз выполнится for i in range(3)?', options: ['2', '3', '4', '1'], correctIndex: 1 },
                    { question: 'Что делает break?', options: ['Пропускает итерацию', 'Прерывает цикл', 'Начинает заново', 'Ничего'], correctIndex: 1 },
                  ]) }
                );
              }

              let lessonsCreated = 0;
              lessons.forEach((l) => {
                db.run(`INSERT INTO lessons (course_id, title, content, type) VALUES (?, ?, ?, ?)`, [courseId, l.title, l.content, l.type], function () {
                  lessonsCreated++;
                  if (lessonsCreated === lessons.length) {
                    created++;
                    if (created === 3) {
                      console.log('\n✅ Демо-данные добавлены!');
                      console.log('Преподаватель: teacher1 / 123');
                      console.log('Студент: student1 / 123');
                      console.log('Предмет: Программирование на Python');
                      console.log('Курсов: 3, Уроков: 9');
                      process.exit(0);
                    }
                  }
                });
              });
            });
          });
        });
      });
    });
  });
}, 500);
