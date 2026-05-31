import { useState } from 'react';
import { motion } from 'framer-motion';

const manipulations = [
  {
    id: 'urgency',
    label: 'Срочность',
    description: '"Время ограничено!", "5 минут на подтверждение!"',
    icon: '⏰',
    isCorrect: true,
    explanation: 'Мошенники создают искусственную срочность, чтобы жертва не успела подумать и принять взвешенное решение.'
  },
  {
    id: 'authority',
    label: 'Авторитет',
    description: '"Я из службы безопасности банка"',
    icon: '👮',
    isCorrect: true,
    explanation: 'Мошенники представляются сотрудниками авторитетных организаций, чтобы вызвать доверие.'
  },
  {
    id: 'fear',
    label: 'Страх',
    description: '"Ваша карта будет заблокирована!"',
    icon: '😨',
    isCorrect: true,
    explanation: 'Запугивание блокировкой карты заставляет жертву действовать быстро и не проверять информацию.'
  },
  {
    id: 'personal',
    label: 'Запрос личных данных',
    description: '"Назовите код из SMS, данные карты"',
    icon: '🔑',
    isCorrect: true,
    explanation: 'Настоящие банки никогда не просят сообщать коды из SMS или данные карты по телефону.'
  },
  {
    id: 'helpful',
    label: 'Предложение помощи',
    description: '"Давайте помогу вам решить проблему"',
    icon: '',
    isCorrect: false,
    explanation: 'Это не манипуляция, а нормальное поведение сотрудника. Но в контексте мошенничества — это часть сценария.'
  },
  {
    id: 'technical',
    label: 'Технические термины',
    description: '"Стандартная процедура безопасности"',
    icon: '🔧',
    isCorrect: true,
    explanation: 'Использование технических терминов создаёт иллюзию профессионализма и вызывает доверие.'
  }
];

function ManipulationAnalysis({ onComplete }) {
  const [found, setFound] = useState({});
  const [showExplanation, setShowExplanation] = useState(null);

  const foundCount = Object.values(found).filter(v => v).length;
  const correctCount = manipulations.filter(m => m.isCorrect).length;

  const handleToggle = (id) => {
    setFound(prev => ({ ...prev, [id]: !prev[id] }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleNext = () => {
    const correctFound = manipulations
      .filter(m => m.isCorrect && found[m.id])
      .length;
    const incorrectFound = manipulations
      .filter(m => !m.isCorrect && found[m.id])
      .length;
    const score = correctFound - incorrectFound;
    onComplete({ score: Math.max(0, score), max: correctCount });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 relative">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-800 flex-shrink-0">
        <h3 className="text-white font-medium mb-1">Анализ манипуляций</h3>
        <p className="text-gray-400 text-xs">Отметьте техники социальной инженерии, которые использовал мошенник</p>
      </div>

      {/* Progress */}
      <div className="px-4 py-2 bg-gray-800/50 flex-shrink-0">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Найдено манипуляций</span>
          <span>{foundCount}/{correctCount}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1">
          <motion.div
            className="h-1 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(foundCount / correctCount) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Manipulations List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {manipulations.map((manipulation, index) => (
          <motion.button
            key={manipulation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleToggle(manipulation.id)}
            className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
              found[manipulation.id]
                ? manipulation.isCorrect
                  ? 'bg-green-900/30 border-green-500'
                  : 'bg-yellow-900/30 border-yellow-500'
                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{manipulation.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-medium text-sm">{manipulation.label}</h4>
                  {found[manipulation.id] && (
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      manipulation.isCorrect
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {manipulation.isCorrect ? '✓ Манипуляция' : '⚠ Не манипуляция'}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs">{manipulation.description}</p>
                {showExplanation === manipulation.id && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-300 mt-2"
                  >
                    {manipulation.explanation}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Next Button - Fixed at bottom */}
      {foundCount > 0 && (
        <div className="px-4 py-3 bg-gray-800 flex-shrink-0 z-50 border-t border-gray-700">
          <button
            onClick={handleNext}
            className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition shadow-lg"
          >
            Продолжить →
          </button>
        </div>
      )}
    </div>
  );
}

export default ManipulationAnalysis;
