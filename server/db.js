const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Путь к файлу базы данных
const DB_PATH = path.join(__dirname, 'database.sqlite');

// Подключение к базе данных (создаст файл, если его нет)
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Ошибка подключения к SQLite:', err.message);
  } else {
    console.log('Подключено к базе данных SQLite.');
    initDB();
  }
});

// Инициализация таблиц
function initDB() {
  db.serialize(() => {
    // Таблица пользователей
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'student'
    )`);

    // Таблица предметов
    db.run(`CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      theme_color TEXT DEFAULT '#3b82f6',
      teacher_id INTEGER,
      FOREIGN KEY(teacher_id) REFERENCES users(id)
    )`);

    // Таблица курсов
    db.run(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER,
      title TEXT,
      description TEXT,
      access_code TEXT UNIQUE,
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    )`);

    // Таблица записи студентов на курсы
    db.run(`CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      course_id INTEGER,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(course_id) REFERENCES courses(id),
      UNIQUE(user_id, course_id)
    )`);

    // Таблица уроков
    db.run(`CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      title TEXT,
      content TEXT,
      type TEXT DEFAULT 'text',
      FOREIGN KEY(course_id) REFERENCES courses(id)
    )`);

    // Таблица прогресса
    db.run(`CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      lesson_id INTEGER,
      completed INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(lesson_id) REFERENCES lessons(id)
    )`);

    // Таблица домашних заданий
    db.run(`CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER UNIQUE,
      title TEXT,
      description TEXT,
      FOREIGN KEY(lesson_id) REFERENCES lessons(id)
    )`);

    // Таблица ответов (решений)
    db.run(`CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assignment_id INTEGER,
      student_id INTEGER,
      content TEXT,
      grade INTEGER,
      feedback TEXT,
      status TEXT DEFAULT 'pending',
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(assignment_id) REFERENCES assignments(id),
      FOREIGN KEY(student_id) REFERENCES users(id),
      UNIQUE(assignment_id, student_id)
    )`);

    console.log('Таблицы инициализированы.');
  });
}

module.exports = db;
