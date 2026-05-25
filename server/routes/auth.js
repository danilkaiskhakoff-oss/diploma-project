const express = require('express');
const db = require('../db');

const router = express.Router();

// Регистрация
router.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  db.run(query, [username, password, role || 'student'], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
    res.status(201).json({ message: 'Регистрация успешна', user: { id: this.lastID, username, role: role || 'student' } });
  });
});

// Вход
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    if (!user) return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });

    res.json({ message: 'Вход выполнен', user: { id: user.id, username: user.username, role: user.role } });
  });
});

module.exports = router;
