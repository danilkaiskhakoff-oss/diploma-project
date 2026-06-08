import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    levels: 0,
    quizzes: 0,
    questions: 0,
    briefings: 0
  });
  const [loading, setLoading] = useState(true);

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
