import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (tab === 'register') {
      if (!displayName.trim()) {
        setError('Введите имя');
        return;
      }
      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }
      if (password.length < 6) {
        setError('Пароль должен быть не менее 6 символов');
        return;
      }
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(displayName, email, password);
      }
      onClose();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Этот email уже зарегистрирован');
      } else if (err.code === 'auth/user-not-found') {
        setError('Пользователь не найден');
      } else if (err.code === 'auth/wrong-password') {
        setError('Неверный пароль');
      } else if (err.code === 'auth/invalid-email') {
        setError('Неверный формат email');
      } else if (err.code === 'auth/weak-password') {
        setError('Пароль слишком слабый');
      } else {
        setError(err.message || 'Ошибка. Попробуйте ещё раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`flex-1 py-4 text-center font-medium transition ${
                  tab === 'login'
                    ? 'text-white border-b-2 border-[#00ff88] bg-gray-800/50'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-4 text-center font-medium transition ${
                  tab === 'register'
                    ? 'text-white border-b-2 border-[#00ff88] bg-gray-800/50'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Регистрация
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition text-xl"
            >
              ✕
            </button>

            {/* Form */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">
                  {tab === 'login' ? '🔑' : '📝'}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {tab === 'login' ? 'Вход в аккаунт' : 'Создать аккаунт'}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {tab === 'login'
                    ? 'Войдите для сохранения прогресса'
                    : 'Зарегистрируйтесь, чтобы сохранять результаты'}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-lg mb-4 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'register' && (
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Имя</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ваше имя"
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-[#00ff88] focus:outline-none transition"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-[#00ff88] focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-[#00ff88] focus:outline-none transition"
                    required
                  />
                </div>

                {tab === 'register' && (
                  <div>
                    <label className="block text-gray-400 text-sm mb-1.5">Подтвердите пароль</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Повторите пароль"
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-[#00ff88] focus:outline-none transition"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#00ff88] text-gray-900 font-bold rounded-lg hover:bg-[#00cc6a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? (tab === 'login' ? 'Вход...' : 'Регистрация...')
                    : (tab === 'login' ? 'Войти' : 'Зарегистрироваться')
                  }
                </button>
              </form>

              <p className="text-gray-500 text-xs text-center mt-4">
                {tab === 'login' ? (
                  <>Нет аккаунта? <button onClick={() => setTab('register')} className="text-[#00ff88] hover:underline">Зарегистрируйтесь</button></>
                ) : (
                  <>Уже есть аккаунт? <button onClick={() => setTab('login')} className="text-[#00ff88] hover:underline">Войдите</button></>
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
