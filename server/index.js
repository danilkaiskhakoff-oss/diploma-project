const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const progressRoutes = require('./routes/progress');
const statsRoutes = require('./routes/stats');
const homeworkRoutes = require('./routes/homework');

// ...

app.use('/api/stats', statsRoutes);
app.use('/api/homework', homeworkRoutes);

// Базовый маршрут для проверки
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', message: 'Backend работает!' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
