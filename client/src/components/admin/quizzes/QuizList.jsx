import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getQuizzesByLevel } from '../../../services/DataService';

const levelIcons = {
  beginner: '🌱',
  intermediate: '🔥',
  advanced: '💀'
};

const levelLabels = {
  beginner: 'Новичок',
  intermediate: 'Средний',
  advanced: 'Продвинутый'
};

function QuizList({ onSelectQuiz }) {
  const [groupedQuizzes, setGroupedQuizzes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const grouped = await getQuizzesByLevel();
      setGroupedQuizzes(grouped);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Загрузка квизов...</div>
      </div>
    );
  }

  const order = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Квизы</h2>

      <div className="space-y-8">
        {order.map(levelId => {
          const group = groupedQuizzes[levelId];
          if (!group || group.quizzes.length === 0) return null;

          return (
            <div key={levelId}>
              {/* Level header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
                <span className="text-2xl">{levelIcons[levelId]}</span>
                <h3 className="text-xl font-bold" style={{ color: group.level.color }}>
                  {group.level.name}
                </h3>
                <span className="text-gray-500 text-sm">
                  {group.quizzes.length} квиз{group.quizzes.length > 1 ? 'ов' : ''}
                </span>
              </div>

              {/* Quiz cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.quizzes.map((quiz) => (
                  <motion.div
                    key={quiz.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectQuiz(quiz.id)}
                    className="bg-gray-900 rounded-xl p-5 border border-gray-800 cursor-pointer hover:border-gray-600 transition group"
                    style={{ borderLeft: `3px solid ${group.level.color}` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-semibold text-white group-hover:text-[#00ff88] transition">
                        {quiz.title}
                      </h4>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: `${group.level.color}20`,
                          color: group.level.color
                        }}
                      >
                        {quiz.questions?.length || 0} вопр.
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-2">{quiz.description || ''}</p>
                    <div className="text-gray-600 text-xs">ID: {quiz.id}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuizList;
