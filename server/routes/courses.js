const express = require('express');
const db = require('../db');

const router = express.Router();

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'EDU-';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

// Получить все курсы предмета
router.get('/subject/:subjectId', (req, res) => {
  db.all('SELECT * FROM courses WHERE subject_id = ?', [req.params.subjectId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json(rows);
  });
});

// Создать курс
router.post('/', (req, res) => {
  const { subject_id, title, description } = req.body;
  if (!subject_id || !title) return res.status(400).json({ message: 'Название и предмет обязательны' });

  const accessCode = generateCode();
  const query = 'INSERT INTO courses (subject_id, title, description, access_code) VALUES (?, ?, ?, ?)';
  db.run(query, [subject_id, title, description || '', accessCode], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.status(201).json({ id: this.lastID, subject_id, title, description, access_code: accessCode });
  });
});

// Получить курс по ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM courses WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    if (!row) return res.status(404).json({ message: 'Курс не найден' });
    res.json(row);
  });
});

// Обновить курс
router.put('/:id', (req, res) => {
  const { title, description } = req.body;
  db.run('UPDATE courses SET title = ?, description = ? WHERE id = ?', [title, description || '', req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json({ message: 'Курс обновлен' });
  });
});

// Удалить курс
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM enrollments WHERE course_id = ?', [req.params.id], () => {
    db.run('DELETE FROM lessons WHERE course_id = ?', [req.params.id], () => {
      db.run('DELETE FROM courses WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ message: 'Ошибка сервера' });
        res.json({ message: 'Курс удален' });
      });
    });
  });
});

// Записаться на курс по коду
router.post('/enroll', (req, res) => {
  const { user_id, access_code } = req.body;
  if (!user_id || !access_code) return res.status(400).json({ message: 'Заполните все поля' });

  db.get('SELECT * FROM courses WHERE access_code = ?', [access_code.toUpperCase()], (err, course) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    if (!course) return res.status(404).json({ message: 'Курс с таким кодом не найден' });

    db.run('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', [user_id, course.id], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(400).json({ message: 'Вы уже записаны на этот курс' });
        return res.status(500).json({ message: 'Ошибка сервера' });
      }
      res.status(201).json({ message: 'Вы записаны на курс!', course: { id: course.id, title: course.title, subject_id: course.subject_id } });
    });
  });
});

// Проверить, записан ли студент на курс
router.get('/:id/enrolled/:userId', (req, res) => {
  db.get('SELECT * FROM enrollments WHERE course_id = ? AND user_id = ?', [req.params.id, req.params.userId], (err, row) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json({ enrolled: !!row });
  });
});

// Получить курсы, на которые записан студент
router.get('/user/:userId', (req, res) => {
  db.all(`
    SELECT c.*, s.name as subject_name
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    JOIN subjects s ON c.subject_id = s.id
    WHERE e.user_id = ?
  `, [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json(rows);
  });
});

module.exports = router;
