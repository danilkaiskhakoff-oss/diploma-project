import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { runMigration } from '../../services/DataService';

function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    levels: 0,
    quizzes: 0,
    questions: 0,
    briefings: 0
  });
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);
  const [migrationError, setMigrationError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await loadStats();
      if (cancelled) return;
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const loadStats = async () => {
    try {
      const levelsSnap = await getDocs(collection(db, 'levels'));
      const quizzesSnap = await getDocs(collection(db, 'quizzes'));
      const briefingsSnap = await getDocs(collection(db, 'briefings'));

      let totalQuestions = 0;
      quizzesSnap.forEach(doc => {
        const data = doc.data();
        if (data.questions) {
          totalQuestions += data.questions.length;
        }
      });

      setStats({
        levels: levelsSnap.size,
        quizzes: quizzesSnap.size,
        questions: totalQuestions,
        briefings: briefingsSnap.size
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = async () => {
    if (!confirm('Запустить миграцию данных в Firestore? Это перезапишет существующие данные.')) return;
    setMigrating(true);
    setMigrationError(null);
    setMigrationResult(null);
    try {
      const result = await runMigration();
      setMigrationResult(result);
      await loadStats();
    } catch (error) {
      setMigrationError(error.message);
    } finally {
      setMigrating(false);
    }
  };

  const colorMap = { blue: 'text-blue-400', green: 'text-green-400', yellow: 'text-yellow-400', purple: 'text-purple-400' };

  const statCards = [
    { icon: '', label: 'Уровни', value: stats.levels, color: 'blue' },
    { icon: '📝', label: 'Квизы', value: stats.quizzes, color: 'green' },
    { icon: '❓', label: 'Вопросы', value: stats.questions, color: 'yellow' },
    { icon: '📚', label: 'Брифинги', value: stats.briefings, color: 'purple' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка статистики...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-3xl font-bold ${colorMap[stat.color] || 'text-gray-400'}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Migration */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Миграция данных</h3>
        <p className="text-gray-400 text-sm mb-4">
          Переносит все уровни, квизы и брифинги из статических файлов в Firestore.
          Запустите один раз при первом развёртывании.
        </p>
        <button
          onClick={handleMigration}
          disabled={migrating}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {migrating ? 'Миграция...' : ' Запустить миграцию данных'}
        </button>
        {migrationResult && (
          <div className="mt-4 bg-green-900/30 border border-green-800 text-green-300 p-3 rounded-lg text-sm">
            ✓ Миграция завершена! Уровней: {migrationResult.levels}, Квизов: {migrationResult.quizzes}, Брифингов: {migrationResult.briefings}
          </div>
        )}
        {migrationError && (
          <div className="mt-4 bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-lg text-sm">
            ✗ Ошибка: {migrationError}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate?.('levels')}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-pointer hover:border-blue-600/50 transition"
          >
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="text-white font-medium mb-1">Редактировать уровни</h4>
            <p className="text-gray-400 text-sm">Управление чекпоинтами и контентом</p>
          </div>
          <div
            onClick={() => onNavigate?.('quizzes')}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-pointer hover:border-blue-600/50 transition"
          >
            <div className="text-2xl mb-2"></div>
            <h4 className="text-white font-medium mb-1">Редактировать квизы</h4>
            <p className="text-gray-400 text-sm">Изменяйте вопросы и ответы</p>
          </div>
          <div
            onClick={() => onNavigate?.('ui-config')}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-pointer hover:border-blue-600/50 transition"
          >
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="text-white font-medium mb-1">Настроить тему</h4>
            <p className="text-gray-400 text-sm">Цвета, шрифты, стили</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
