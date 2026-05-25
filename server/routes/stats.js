const express = require('express');
const db = require('../db');

const router = express.Router();

// Получить статистику по предмету для преподавателя
router.get('/subject/:subjectId', (req, res) => {
  db.all(`
    SELECT 
      u.id as user_id,
      u.username,
      COUNT(DISTINCT l.id) as total_lessons,
      COUNT(DISTINCT CASE WHEN p.completed = 1 THEN l.id END) as completed_lessons,
      AVG(CASE WHEN p.completed = 1 THEN p.score END) as avg_score
    FROM users u
    CROSS JOIN lessons l ON l.course_id IN (SELECT id FROM courses WHERE subject_id = ?)
    LEFT JOIN progress p ON p.user_id = u.id AND p.lesson_id = l.id
    WHERE u.role = 'student'
    GROUP BY u.id
  `, [req.params.subjectId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });

    const students = rows.map(row => ({
      user_id: row.user_id,
      username: row.username,
      total_lessons: row.total_lessons,
      completed_lessons: row.completed_lessons,
      percentage: row.total_lessons > 0 ? Math.round((row.completed_lessons / row.total_lessons) * 100) : 0,
      avg_score: row.avg_score ? Math.round(row.avg_score) : 0,
    }));

    res.json({ students });
  });
});

// Получить детальную статистику по студенту
router.get('/student/:studentId/subject/:subjectId', (req, res) => {
  db.all(`
    SELECT 
      c.id as course_id,
      c.title as course_title,
      l.id as lesson_id,
      l.title as lesson_title,
      l.type as lesson_type,
      p.completed,
      p.score
    FROM courses c
    JOIN lessons l ON l.course_id = c.id
    LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = ?
    WHERE c.subject_id = ?
    ORDER BY c.id, l.id
  `, [req.params.studentId, req.params.subjectId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json({ lessons: rows });
  });
});

module.exports = router;
