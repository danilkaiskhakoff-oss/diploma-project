import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

function AdminPasswordReset({ onClose }) {
  const { resetPassword } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Введите email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Введите корректный email');
      return;
    }

    if (adminEmail && email !== adminEmail) {
      setError('Этот email не является email администратора');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess('Ссылка для сброса пароля отправлена на ' + email);
      setEmail('');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Пользователь с таким email не найден');
      } else if (err.code === 'auth/invalid-email') {
        setError('Неверный формат email');
      } else {
        setError(err.message || 'Ошибка. Попробуйте ещё раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
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
          className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl overflow-visible relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition text-xl z-10"
          >
            ✕
          </button>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-xl font-bold text-white">Сброс пароля администратора</h2>
              <p className="text-gray-400 text-sm mt-1">
                Введите email администратора, и мы отправим ссылку для сброса пароля
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

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/30 border border-green-800 text-green-300 p-3 rounded-lg mb-4 text-sm"
              >
                {success}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Email администратора</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-[#00ff88] focus:outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00ff88] text-gray-900 font-bold rounded-lg hover:bg-[#00cc6a] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Отправка...' : 'Отправить ссылку'}
              </button>
            </form>

            <p className="text-gray-500 text-xs text-center mt-4">
              <button onClick={onClose} className="text-[#00ff88] hover:underline">
                ← Вернуться ко входу
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AdminPasswordReset;
