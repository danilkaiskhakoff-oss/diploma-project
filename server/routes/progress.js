const express = require('express');
const db = require('../db');

const router = express.Router();

// Получить прогресс студента по курсу
router.get('/course/:courseId/user/:userId', (req, res) => {
  db.all(`
    SELECT l.id as lesson_id, l.title, p.completed, p.score
    FROM lessons l
    LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ?
    WHERE l.course_id = ?
  `, [req.params.userId, req.params.courseId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    
    const total = rows.length;
    const completed = rows.filter(r => r.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    res.json({ lessons: rows, total, completed, percentage });
  });
});

// Отметить урок как пройденный
router.post('/complete', (req, res) => {
  const { user_id, lesson_id, score } = req.body;

  db.get('SELECT id FROM progress WHERE user_id = ? AND lesson_id = ?', [user_id, lesson_id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });

    if (row) {
      db.run('UPDATE progress SET completed = 1, score = ? WHERE user_id = ? AND lesson_id = ?', [score || 0, user_id, lesson_id], function (err) {
        if (err) return res.status(500).json({ message: 'Ошибка сервера' });
        res.json({ message: 'Прогресс обновлен' });
      });
    } else {
      db.run('INSERT INTO progress (user_id, lesson_id, completed, score) VALUES (?, ?, 1, ?)', [user_id, lesson_id, score || 0], function (err) {
        if (err) return res.status(500).json({ message: 'Ошибка сервера' });
        res.json({ message: 'Урок пройден' });
      });
    }
  });
});

// Сбросить прогресс урока
router.post('/reset', (req, res) => {
  const { user_id, lesson_id } = req.body;
  db.run('UPDATE progress SET completed = 0, score = 0 WHERE user_id = ? AND lesson_id = ?', [user_id, lesson_id], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json({ message: 'Прогресс сброшен' });
  });
});

module.exports = router;
