import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase/config';

function UserList() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Введите корректный email');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Ссылка для сброса пароля отправлена на ' + email);
      setEmail('');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Пользователь с таким email не найден');
      } else if (err.code === 'auth/invalid-email') {
        setError('Неверный формат email');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Слишком много запросов. Попробуйте позже');
      } else {
        setError(err.message || 'Ошибка при отправке');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Управление пользователями</h1>
        <p className="text-gray-400 text-sm">
          Администратор может инициировать сброс пароля пользователя через отправку email-уведомления.
          Пользователь получит письмо со ссылкой для самостоятельной установки нового пароля.
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Сброс пароля пользователя</h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-lg mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-900/30 border border-green-800 text-green-300 p-3 rounded-lg mb-4 text-sm"
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1.5">Email пользователя</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Отправка...' : 'Отправить ссылку сброса пароля'}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-lg">
        <h2 className="text-lg font-semibold text-white mb-3">Как это работает</h2>
        <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
          <li>Администратор вводит email пользователя</li>
          <li>Нажимает кнопку «Отправить ссылку сброса пароля»</li>
          <li>Firebase отправляет email пользователю со ссылкой</li>
          <li>Пользователь переходит по ссылке и устанавливает новый пароль</li>
        </ol>
        <p className="text-gray-500 text-xs mt-3">
          Ссылка действительна 1 час. Администратор не видит и не задаёт пароль — это обеспечивает безопасность аккаунтов пользователей.
        </p>
      </div>
    </div>
  );
}

export default UserList;
