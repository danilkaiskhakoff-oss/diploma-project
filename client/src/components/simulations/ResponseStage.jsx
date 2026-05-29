import { useState } from 'react';
import { motion } from 'framer-motion';

const responseActions = [
  {
    id: 'changePasswords',
    label: 'Сменить все пароли',
    description: 'Немедленно сменить пароли всех учётных записей',
    icon: '',
    isCorrect: true,
    explanation: 'Смена паролей предотвращает дальнейший доступ хакера'
  },
  {
    id: 'notifyUsers',
    label: 'Уведомить пользователей',
    description: 'Сообщить о утечке данных',
    icon: '📢',
    isCorrect: true,
    explanation: 'Пользователи должны знать о рисках для своих данных'
  },
  {
    id: 'updateSecurity',
    label: 'Обновить защиту',
    description: 'Установить патчи и обновить ПО',
    icon: '🔄',
    isCorrect: true,
    explanation: 'Обновления закрывают уязвимости, использованные хакером'
  },
  {
    id: 'investigate',
    label: 'Расследование',
    description: 'Выяснить масштаб утечки',
    icon: '🔍',
    isCorrect: true,
    explanation: 'Расследование помогает понять, что было украдено'
  },
  {
    id: 'hide',
    label: 'Скрыть инцидент',
    description: 'Не сообщать никому о утечке',
    icon: '',
    isCorrect: false,
    explanation: 'Сокрытие инцидента — незаконно и опасно!'
  },
  {
    id: 'ignore',
    label: 'Игнорировать',
    description: 'Ничего не делать, авось пронесёт',
    icon: '',
    isCorrect: false,
    explanation: 'Игнорирование приведёт к повторным атакам'
  }
];

function ResponseStage({ onComplete }) {
  const [selected, setSelected] = useState({});
  const [showExplanation, setShowExplanation] = useState(null);

  const selectedCount = Object.values(selected).filter(v => v).length;

  const handleToggle = (id) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleNext = () => {
    const correctSelected = responseActions
      .filter(a => a.isCorrect && selected[a.id])
      .length;
    const incorrectSelected = responseActions
      .filter(a => !a.isCorrect && selected[a.id])
      .length;
    const score = correctSelected - incorrectSelected;
    onComplete({ score: Math.max(0, score), max: responseActions.filter(a => a.isCorrect).length });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-green-500/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🛡️</span>
          <div>
            <h2 className="text-xl font-bold text-green-400">Этап 5: Реагирование на инцидент</h2>
            <p className="text-sm text-gray-400">Атака обнаружена! Нужно действовать</p>
          </div>
        </div>
        <p className="text-sm text-gray-300">
          Выберите правильные действия для реагирования на инцидент
        </p>
      </div>

      {/* Alert Animation */}
      <div className="bg-red-900/30 rounded-lg p-4 mb-4 border border-red-500/50">
        <motion.div
          className="flex items-center justify-center gap-3"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-2xl"></span>
          <span className="text-red-400 font-bold text-lg">ВНИМАНИЕ: ОБНАРУЖЕНА УТЕЧКА ДАННЫХ!</span>
          <span className="text-2xl"></span>
        </motion.div>
      </div>

      {/* Response Panel */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-white mb-3">Панель реагирования</h3>
        <div className="grid grid-cols-2 gap-3">
          {responseActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleToggle(action.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selected[action.id]
                  ? action.isCorrect
                    ? 'bg-green-900/30 border-green-500'
                    : 'bg-red-900/30 border-red-500'
                  : 'bg-gray-700 border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium text-white">{action.label}</span>
              </div>
              <p className="text-xs text-gray-400">{action.description}</p>
              {showExplanation === action.id && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs mt-2 ${
                    action.isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {action.explanation}
                </motion.p>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Выбрано действий</span>
          <span>{selectedCount}/{responseActions.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(selectedCount / responseActions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
      >
        Продолжить →
      </button>
    </div>
  );
}

export default ResponseStage;