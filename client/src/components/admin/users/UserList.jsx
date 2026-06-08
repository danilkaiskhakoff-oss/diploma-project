import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import { calculateStats } from '../../../services/ProgressService';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'reports'
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [reportFilter, setReportFilter] = useState('all'); // all, beginner, intermediate, advanced

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const stats = calculateStats(data.progress || {});
        usersData.push({
          id: docSnap.id,
          email: data.email || '—',
          displayName: data.displayName || '—',
          createdAt: data.createdAt?.toDate?.() || null,
          progress: stats,
          rawProgress: data.progress || {}
        });
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setError('Введите корректный email');
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage('Ссылка для сброса пароля отправлена на ' + resetEmail);
      setResetEmail('');
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
      setResetLoading(false);
    }
  };

  const handleDeleteUser = async (userId, displayName) => {
    if (!confirm(`Удалить пользователя "${displayName}"? Прогресс будет потерян.`)) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      setMessage('Пользователь удалён');
    } catch (error) {
      setError('Ошибка удаления: ' + error.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Имя', 'Прогресс (%)', 'Пройдено чекпоинтов', 'Всего чекпоинтов', 'Дата регистрации'];
    const rows = users.map(u => [
      u.email,
      u.displayName,
      u.progress?.overallPercentage || 0,
      u.progress?.completedCheckpoints || 0,
      u.progress?.totalCheckpoints || 0,
      u.createdAt ? u.createdAt.toLocaleDateString('ru-RU') : '—'
    ]);
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    downloadFile(csv, 'users_report.csv', 'text/csv;charset=utf-8;');
  };

  const exportJSON = () => {
    const data = users.map(u => ({
      email: u.email,
      displayName: u.displayName,
      progress: u.progress?.overallPercentage || 0,
      completedCheckpoints: u.progress?.completedCheckpoints || 0,
      totalCheckpoints: u.progress?.totalCheckpoints || 0,
      createdAt: u.createdAt ? u.createdAt.toISOString() : null
    }));
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'users_report.json', 'application/json');
  };

  const formatDate = (date) => {
    if (!date) return '—';
    if (date?.toDate) return date.toDate().toLocaleDateString('ru-RU');
    if (date instanceof Date) return date.toLocaleDateString('ru-RU');
    return '—';
  };

  const exportDetailedCSV = () => {
    const headers = ['Пользователь', 'Email', 'Уровень', 'Чекпоинт', 'Баллы', 'Максимум', 'Попытки', 'Дата завершения'];
    const rows = [];
    users.forEach(u => {
      if (u.progress?.details) {
        u.progress.details.forEach(d => {
          if (d.completed) {
            rows.push([
              u.displayName,
              u.email,
              d.levelName,
              d.title,
              d.score,
              d.total,
              d.attempts,
              formatDate(d.completedAt)
            ]);
          }
        });
      }
    });
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    downloadFile(csv, 'detailed_report.csv', 'text/csv;charset=utf-8;');
  };

  const downloadFile = (content, filename, type) => {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredUsers = () => {
    if (reportFilter === 'all') return users;
    const levelMap = { beginner: 'Новичок', intermediate: 'Средний', advanced: 'Продвинутый' };
    const levelName = levelMap[reportFilter];
    return users.filter(u => {
      const levelStat = u.progress?.levelStats?.[reportFilter];
      return levelStat && levelStat.completed > 0;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка пользователей...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Управление пользователями</h1>
        <p className="text-gray-400 text-sm">
          Всего пользователей: {users.length}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'users' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          👥 Пользователи
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'reports' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          📊 Отчёты
        </button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-lg mb-4 text-sm">
          {error}
        </motion.div>
      )}

      {message && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-green-900/30 border border-green-800 text-green-300 p-3 rounded-lg mb-4 text-sm">
          {message}
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Password Reset */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Сброс пароля пользователя</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1.5">Email пользователя</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {resetLoading ? 'Отправка...' : 'Отправить ссылку сброса пароля'}
              </button>
            </form>
          </div>

          {/* Users Table */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Список пользователей</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50 text-gray-400">
                  <tr>
                    <th className="text-left p-3">Имя</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-center p-3">Прогресс</th>
                    <th className="text-center p-3">Чекпоинты</th>
                    <th className="text-center p-3">Дата регистрации</th>
                    <th className="text-center p-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-8 text-gray-500">Нет пользователей</td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                        <td className="p-3 text-white">{user.displayName}</td>
                        <td className="p-3 text-gray-400">{user.email}</td>
                        <td className="p-3 text-center">
                          <span className={`font-bold ${
                            user.progress?.overallPercentage >= 70 ? 'text-green-400' :
                            user.progress?.overallPercentage >= 30 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {user.progress?.overallPercentage || 0}%
                          </span>
                        </td>
                        <td className="p-3 text-center text-gray-400">
                          {user.progress?.completedCheckpoints || 0}/{user.progress?.totalCheckpoints || 0}
                        </td>
                        <td className="p-3 text-center text-gray-500">
                          {user.createdAt ? user.createdAt.toLocaleDateString('ru-RU') : '—'}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteUser(user.id, user.displayName)}
                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-900/30 transition"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Export Buttons */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Экспорт отчётов</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
              >
                📄 Экспорт CSV (сводка)
              </button>
              <button
                onClick={exportDetailedCSV}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                📊 Экспорт CSV (детальный)
              </button>
              <button
                onClick={exportJSON}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
              >
                🔧 Экспорт JSON
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Фильтр по уровню</h2>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Все' },
                { id: 'beginner', label: '🌱 Новичок' },
                { id: 'intermediate', label: '🔥 Средний' },
                { id: 'advanced', label: ' Продвинутый' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setReportFilter(f.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition ${
                    reportFilter === f.id ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-gray-400 hover:text-white border border-gray-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Report Table */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Детальный отчёт по результатам</h2>
              <p className="text-gray-500 text-sm mt-1">
                Показаны только завершённые чекпоинты
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50 text-gray-400">
                  <tr>
                    <th className="text-left p-3">Пользователь</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Уровень</th>
                    <th className="text-left p-3">Чекпоинт</th>
                    <th className="text-center p-3">Баллы</th>
                    <th className="text-center p-3">Попытки</th>
                    <th className="text-center p-3">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = getFilteredUsers();
                    const rows = [];
                    filtered.forEach(u => {
                      if (u.progress?.details) {
                        u.progress.details.forEach(d => {
                          if (d.completed && (reportFilter === 'all' || d.levelId === reportFilter)) {
                            rows.push(
                              <tr key={`${u.id}-${d.checkpointId}`} className="border-t border-gray-800 hover:bg-gray-800/30">
                                <td className="p-3 text-white">{u.displayName}</td>
                                <td className="p-3 text-gray-400">{u.email}</td>
                                <td className="p-3">
                                  <span style={{ color: d.levelColor }}>{d.levelName}</span>
                                </td>
                                <td className="p-3 text-gray-300">{d.title}</td>
                                <td className="p-3 text-center">
                                  <span className={`font-bold ${
                                    d.score === d.total ? 'text-green-400' : 'text-yellow-400'
                                  }`}>
                                    {d.score}/{d.total}
                                  </span>
                                </td>
                                <td className="p-3 text-center text-gray-400">{d.attempts}</td>
                                <td className="p-3 text-center text-gray-500">
                                  {formatDate(d.completedAt)}
                                </td>
                              </tr>
                            );
                          }
                        });
                      }
                    });
                    return rows.length > 0 ? rows : (
                      <tr>
                        <td colSpan="7" className="text-center p-8 text-gray-500">Нет данных</td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
