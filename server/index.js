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

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
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
