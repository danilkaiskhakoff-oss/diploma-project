const express = require('express');
const db = require('../db');

const router = express.Router();

// Получить все предметы
router.get('/', (req, res) => {
  db.all('SELECT * FROM subjects', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json(rows);
  });
});

// Создать предмет
router.post('/', (req, res) => {
  const { name, description, theme_color, teacher_id } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Название обязательно' });
  }

  const query = 'INSERT INTO subjects (name, description, theme_color, teacher_id) VALUES (?, ?, ?, ?)';
  db.run(query, [name, description || '', theme_color || '#3b82f6', teacher_id], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.status(201).json({ id: this.lastID, name, description, theme_color, teacher_id });
  });
});

// Получить предмет по ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM subjects WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    if (!row) return res.status(404).json({ message: 'Предмет не найден' });
    res.json(row);
  });
});

module.exports = router;
