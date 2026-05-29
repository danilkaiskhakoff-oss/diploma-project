import { useState } from 'react';
import { motion } from 'framer-motion';

const protections = [
  {
    id: 'antivirus',
    label: 'Антивирус',
    description: 'Обнаруживает и удаляет вредоносное ПО',
    icon: '🛡️',
    isCorrect: true,
    explanation: 'Антивирус — первая линия защиты от вредоносов'
  },
  {
    id: 'firewall',
    label: 'Файрвол',
    description: 'Блокирует подозрительный сетевой трафик',
    icon: '🔥',
    isCorrect: true,
    explanation: 'Файрвол предотвращает несанкционированный доступ'
  },
  {
    id: 'updates',
    label: 'Обновления ПО',
    description: 'Закрывает известные уязвимости',
    icon: '🔄',
    isCorrect: true,
    explanation: 'Обновления закрывают дыры, которые используют хакеры'
  },
  {
    id: 'backup',
    label: 'Резервные копии',
    description: 'Восстановление данных после атаки',
    icon: '💾',
    isCorrect: true,
    explanation: 'Бэкапы позволяют восстановить данные после шифрования'
  },
  {
    id: 'ignore',
    label: 'Игнорировать предупреждения',
    description: 'Не обращать внимание на сигналы тревоги',
    icon: '',
    isCorrect: false,
    explanation: 'Игнорирование предупреждений — главная ошибка!'
  },
  {
    id: 'disable',
    label: 'Отключить защиту',
    description: 'Выключить антивирус для "скорости"',
    icon: '⚠️',
    isCorrect: false,
    explanation: 'Отключение защиты открывает дверь для атак'
  }
];

function InstallationStage({ onComplete }) {
  const [enabled, setEnabled] = useState({});
  const [showExplanation, setShowExplanation] = useState(null);

  const enabledCount = Object.values(enabled).filter(v => v).length;

  const handleToggle = (id) => {
    setEnabled(prev => ({ ...prev, [id]: !prev[id] }));
    setShowExplanation(id);
    setTimeout(() => setShowExplanation(null), 3000);
  };

  const handleNext = () => {
    const correctEnabled = protections
      .filter(p => p.isCorrect && enabled[p.id])
      .length;
    const incorrectEnabled = protections
      .filter(p => !p.isCorrect && enabled[p.id])
      .length;
    const score = correctEnabled - incorrectEnabled;
    onComplete({ score: Math.max(0, score), max: protections.filter(p => p.isCorrect).length });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl"></span>
          <div>
            <h2 className="text-xl font-bold text-purple-400">Этап 3: Установка вредоноса</h2>
            <p className="text-sm text-gray-400">Сотрудник кликнул на ссылку → скачался вирус</p>
          </div>
        </div>
        <p className="text-sm text-gray-300">
          Включите правильные меры защиты, чтобы остановить вредонос
        </p>
      </div>

      {/* Infection Animation */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            className="text-4xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🦠
          </motion.div>
          <motion.div
            className="h-0.5 flex-1 bg-gradient-to-r from-red-500 to-purple-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1 }}
          />
          <div className="text-4xl">💻</div>
        </div>
        <p className="text-center text-sm text-gray-400">
          Вредонос распространяется по системе...
        </p>
      </div>

      {/* Protection Panel */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-white mb-3">Панель управления защитой</h3>
        <div className="grid grid-cols-2 gap-3">
          {protections.map((protection, index) => (
            <motion.button
              key={protection.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleToggle(protection.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                enabled[protection.id]
                  ? protection.isCorrect
                    ? 'bg-green-900/30 border-green-500'
                    : 'bg-red-900/30 border-red-500'
                  : 'bg-gray-700 border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{protection.icon}</span>
                <span className="font-medium text-white">{protection.label}</span>
              </div>
              <p className="text-xs text-gray-400">{protection.description}</p>
              {showExplanation === protection.id && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs mt-2 ${
                    protection.isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {protection.explanation}
                </motion.p>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-800 rounded-lg p-3 mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Активировано защит</span>
          <span>{enabledCount}/{protections.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(enabledCount / protections.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition"
      >
        Продолжить →
      </button>
    </div>
  );
}

export default InstallationStage;