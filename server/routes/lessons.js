const express = require('express');
const db = require('../db');

const router = express.Router();

// Получить все уроки курса
router.get('/course/:courseId', (req, res) => {
  db.all('SELECT * FROM lessons WHERE course_id = ?', [req.params.courseId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json(rows);
  });
});

// Создать урок
router.post('/', (req, res) => {
  const { course_id, title, content, type } = req.body;

  if (!course_id || !title) {
    return res.status(400).json({ message: 'Название и курс обязательны' });
  }

  const query = 'INSERT INTO lessons (course_id, title, content, type) VALUES (?, ?, ?, ?)';
  db.run(query, [course_id, title, content || '', type || 'text'], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.status(201).json({ id: this.lastID, course_id, title, content, type });
  });
});

// Получить урок по ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM lessons WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    if (!row) return res.status(404).json({ message: 'Урок не найден' });
    res.json(row);
  });
});

// Обновить урок
router.put('/:id', (req, res) => {
  const { title, content, type } = req.body;
  const query = 'UPDATE lessons SET title = ?, content = ?, type = ? WHERE id = ?';
  db.run(query, [title, content || '', type || 'text', req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json({ message: 'Урок обновлен' });
  });
});

// Удалить урок
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM lessons WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json({ message: 'Урок удален' });
  });
});

module.exports = router;
