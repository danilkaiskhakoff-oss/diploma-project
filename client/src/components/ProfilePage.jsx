import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getProgress, calculateStats, getAchievements, resetProgress } from '../services/ProgressService';

function ProfilePage({ onNavigate }) {
  const { user, logout, updateDisplayName } = useAuth();

  const handleLogout = async () => {
    await logout();
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, completed, incomplete
  const [sortBy, setSortBy] = useState('date'); // date, score, name

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await loadProgress();
      if (cancelled) return;
    };
    run();
    return () => { cancelled = true; };
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;
    const progress = await getProgress(user.id, user.type === 'registered');
    const calculated = calculateStats(progress);
    const ach = getAchievements(progress);
    setStats(calculated);
    setAchievements(ach);
    setLoading(false);
  };

  const handleSaveName = async () => {
    if (newName.trim()) {
      await updateDisplayName(newName.trim());
      setEditingName(false);
    }
  };

  const handleReset = async () => {
    if (user) {
      await resetProgress(user.id, user.type === 'registered');
      await loadProgress();
      setShowResetConfirm(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const d = value?.toDate ? value.toDate() : new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getFilteredDetails = () => {
    if (!stats?.details) return [];
    let filtered = [...stats.details];
    if (filter === 'completed') filtered = filtered.filter(d => d.completed);
    if (filter === 'incomplete') filtered = filtered.filter(d => !d.completed);

    if (sortBy === 'date') {
      filtered.sort((a, b) => {
        if (!a.completedAt) return 1;
        if (!b.completedAt) return -1;
        return new Date(b.completedAt) - new Date(a.completedAt);
      });
    } else if (sortBy === 'score') {
      filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    );
  }

  const filteredDetails = getFilteredDetails();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Back button */}
      <div className="max-w-5xl mx-auto px-6 pt-4">
        <button
          onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }}
          className="px-4 py-2 bg-[#1a1a2e] border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-[#00ff88] transition text-sm cursor-pointer"
        >
          ← На главную
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00ff88] to-blue-500 flex items-center justify-center text-2xl font-bold text-gray-900">
                {user?.displayName?.charAt(0).toUpperCase() || 'П'}
              </div>
              <div>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-gray-800 text-white px-3 py-1 rounded-lg border border-gray-700 focus:border-[#00ff88] focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    />
                    <button onClick={handleSaveName} className="text-[#00ff88] text-sm hover:underline">✓</button>
                    <button onClick={() => setEditingName(false)} className="text-gray-500 text-sm hover:text-white">✕</button>
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold cursor-pointer hover:text-[#00ff88] transition" onClick={() => { setEditingName(true); setNewName(user?.displayName || ''); }}>
                    {user?.displayName}
                  </h1>
                )}
                <p className="text-gray-400 text-sm">{user?.email || 'Анонимный режим'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-800 rounded-lg transition"
              >
                Сбросить прогресс
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition border border-gray-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <p className="text-gray-400 text-sm mb-1">Общий прогресс</p>
            <p className="text-4xl font-bold text-[#00ff88]">{stats?.overallPercentage || 0}%</p>
            <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#00ff88] to-blue-500 transition-all duration-500"
                style={{ width: `${stats?.overallPercentage || 0}%` }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">{stats?.completedCheckpoints || 0} / {stats?.totalCheckpoints || 0} чекпоинтов</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <p className="text-gray-400 text-sm mb-1">Общий балл</p>
            <p className="text-4xl font-bold text-yellow-400">{stats?.averageScore || '0/0'}</p>
            <p className="text-gray-500 text-xs mt-3">набрано / возможно</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <p className="text-gray-400 text-sm mb-1">Достижения</p>
            <p className="text-4xl font-bold text-purple-400">
              {achievements.length > 0 ? achievements.filter(a => a.unlocked).length : 0} / {achievements.length || 1}
            </p>
            <p className="text-gray-500 text-xs mt-3">разблокировано</p>
          </motion.div>
        </div>

        {/* Level Progress */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-[#00ff88]">📈</span> Прогресс по уровням
          </h2>
          <div className="space-y-3">
            {stats?.levelStats && Object.entries(stats.levelStats).map(([levelId, ls]) => (
              <motion.div
                key={levelId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-xl p-4 border border-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {levelId === 'beginner' ? '🌱' : levelId === 'intermediate' ? '🔥' : '💀'}
                    </span>
                    <span className="font-bold">{ls.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{ls.completed}/{ls.total}</span>
                    <span className="text-sm font-bold" style={{ color: ls.color }}>{ls.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${ls.percentage}%`, backgroundColor: ls.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detailed Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-[#00ff88]"></span> Детальные результаты
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-xs transition ${filter === 'all' ? 'bg-[#00ff88] text-gray-900 font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                  Все
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1 text-xs transition ${filter === 'completed' ? 'bg-[#00ff88] text-gray-900 font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                  Пройденные
                </button>
                <button
                  onClick={() => setFilter('incomplete')}
                  className={`px-3 py-1 text-xs transition ${filter === 'incomplete' ? 'bg-[#00ff88] text-gray-900 font-medium' : 'text-gray-400 hover:text-white'}`}
                >
                  Непройденные
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-lg border border-gray-700 focus:border-[#00ff88] focus:outline-none"
              >
                <option value="date">По дате</option>
                <option value="score">По баллу</option>
                <option value="name">По названию</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/50">
                    <th className="text-left p-4 text-gray-400 font-medium">Тема</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Уровень</th>
                    <th className="text-center p-4 text-gray-400 font-medium">Статус</th>
                    <th className="text-center p-4 text-gray-400 font-medium">Балл</th>
                    <th className="text-center p-4 text-gray-400 font-medium hidden md:table-cell">Лучший</th>
                    <th className="text-center p-4 text-gray-400 font-medium hidden md:table-cell">Попытки</th>
                    <th className="text-right p-4 text-gray-400 font-medium">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDetails.map((d, i) => (
                    <tr key={d.checkpointId} className={`border-b border-gray-800/50 ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/50'}`}>
                      <td className="p-4 font-medium">{d.title}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: d.levelColor + '20', color: d.levelColor }}>
                          {d.levelName}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {d.completed ? (
                          <span className="text-[#00ff88]">✓ Пройден</span>
                        ) : (
                          <span className="text-gray-600">○ Не начат</span>
                        )}
                      </td>
                      <td className="p-4 text-center font-mono">
                        {d.completed ? `${d.score}/${d.total}` : '—'}
                      </td>
                      <td className="p-4 text-center font-mono hidden md:table-cell">
                        {d.completed ? `${d.bestScore}/${d.bestTotal}` : '—'}
                      </td>
                      <td className="p-4 text-center font-mono hidden md:table-cell">
                        {d.attempts || '—'}
                      </td>
                      <td className="p-4 text-right text-gray-500">
                        {formatDate(d.completedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-[#00ff88]">🏆</span> Достижения
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-xl p-5 border transition ${
                  a.unlocked
                    ? 'bg-gray-900 border-gray-700 hover:border-[#00ff88]/50'
                    : 'bg-gray-900/30 border-gray-800 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{a.icon}</div>
                <h3 className="font-bold text-sm">{a.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{a.description}</p>
                {a.unlocked && (
                  <div className="mt-2 text-[#00ff88] text-xs font-medium">✓ Разблокировано</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 rounded-2xl border border-red-800/50 p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Сбросить прогресс?</h3>
            <p className="text-gray-400 text-sm mb-4">Все ваши результаты будут удалены. Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
