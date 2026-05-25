const express = require('express');
const db = require('../db');

const router = express.Router();

// === ЗАДАНИЯ (Для преподавателя) ===

// Создать задание для урока
router.post('/', (req, res) => {
  const { lesson_id, title, description } = req.body;
  if (!lesson_id || !title) return res.status(400).json({ message: 'Заполните название' });

  // Используем INSERT OR REPLACE, чтобы можно было обновить задание
  const query = `INSERT OR REPLACE INTO assignments (lesson_id, title, description) VALUES (?, ?, ?)`;
  db.run(query, [lesson_id, title, description || ''], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json({ message: 'Задание сохранено', id: this.lastID || lesson_id }); // lastID может быть 0 при REPLACE, поэтому берем lesson_id
  });
});

// Получить задание урока
router.get('/lesson/:lessonId', (req, res) => {
  db.get('SELECT * FROM assignments WHERE lesson_id = ?', [req.params.lessonId], (err, row) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json(row || null);
  });
});

// === ОТВЕТЫ (Для студента и преподавателя) ===

// Отправить ответ (Студент)
router.post('/submit', (req, res) => {
  const { assignment_id, student_id, content } = req.body;
  if (!assignment_id || !content) return res.status(400).json({ message: 'Ответ пуст' });

  const query = `INSERT INTO submissions (assignment_id, student_id, content, status) 
                 VALUES (?, ?, ?, 'pending')
                 ON CONFLICT(assignment_id, student_id) DO UPDATE SET content=excluded.content, status='pending', grade=NULL, feedback=NULL, submitted_at=CURRENT_TIMESTAMP`;
  
  db.run(query, [assignment_id, student_id, content], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json({ message: 'Ответ отправлен' });
  });
});

// Получить все ответы на задание (Преподаватель)
router.get('/submissions/:assignmentId', (req, res) => {
  db.all(`
    SELECT s.*, u.username 
    FROM submissions s 
    JOIN users u ON s.student_id = u.id 
    WHERE s.assignment_id = ?
    ORDER BY s.submitted_at DESC
  `, [req.params.assignmentId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json(rows);
  });
});

// Получить мой ответ (Студент)
router.get('/my-submission/:assignmentId/:userId', (req, res) => {
  db.get('SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?', [req.params.assignmentId, req.params.userId], (err, row) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json(row || null);
  });
});

// Оценить ответ (Преподаватель)
router.put('/grade/:submissionId', (req, res) => {
  const { grade, feedback } = req.body;
  const query = 'UPDATE submissions SET grade = ?, feedback = ?, status = "graded" WHERE id = ?';
  db.run(query, [grade, feedback || '', req.params.submissionId], function (err) {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json({ message: 'Оценка выставлена' });
  });
});

module.exports = router;
